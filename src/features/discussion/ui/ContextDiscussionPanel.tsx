'use client';

import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MessageSquareText, RefreshCw, Users } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { discussionApi } from '../api/discussion.api';
import {
  DiscussionContextRequest,
  DiscussionContextResponse,
  DiscussionContextType,
} from '../model/discussion.types';
import { DiscussionComposer } from './DiscussionComposer';
import { DiscussionPostCard } from './DiscussionPostCard';

interface ContextDiscussionPanelProps {
  contextType: DiscussionContextType;
  subjectId?: string;
  unitId?: string;
  resourceId?: string;
  title: string;
  description: string;
  mode?: 'board' | 'chat';
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export const ContextDiscussionPanel = ({
  contextType,
  subjectId,
  unitId,
  resourceId,
  title,
  description,
  mode = 'board',
}: ContextDiscussionPanelProps) => {
  const [discussion, setDiscussion] = useState<DiscussionContextResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const isChat = mode === 'chat';
  const viewer = useAuthStore((state) => state.user);

  const composerPlaceholder = contextType === 'global'
    ? 'Type a message for the community, ask a doubt, or share a study tip'
    : 'Ask a doubt, share an explanation, or discuss a PYQ pattern here';

  const emptyStateDescription = contextType === 'global'
    ? 'Start the first community message. Everyone in the student workspace can read and reply here.'
    : 'Start the first academic discussion for this context. Seniors and classmates will see it in the same subject workflow.';

  const submitLabel = contextType === 'global' ? 'Send message' : 'Post discussion';

  const request = useMemo<DiscussionContextRequest | null>(() => {
    if (contextType === 'global') {
      return { contextType };
    }
    if (contextType === 'subject' && subjectId) {
      return { contextType, subjectId };
    }
    if (contextType === 'unit' && unitId) {
      return { contextType, unitId };
    }
    if (contextType === 'pyq-resource' && resourceId) {
      return { contextType, resourceId };
    }
    if (contextType === 'model-paper-subject' && subjectId) {
      return { contextType, subjectId };
    }
    return null;
  }, [contextType, resourceId, subjectId, unitId]);

  const loadDiscussion = useCallback(async (silent = false) => {
    if (!request) return;

    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await discussionApi.getContext(request);
      setDiscussion(data);
      setError('');
    } catch (fetchError) {
      setError(getErrorMessage(fetchError, 'Discussion could not be loaded right now.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [request]);

  useEffect(() => {
    if (!request) return;
    void loadDiscussion();
  }, [loadDiscussion, request]);

  useEffect(() => {
    if (!isChat || !messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [discussion?.thread.postCount, isChat]);

  const createPost = async (body: string, parentId?: string) => {
    if (!request) return;
    try {
      setError('');
      await discussionApi.createPost({
        ...request,
        body,
        parentId,
        authorSnapshot: viewer
          ? {
            clientUserId: viewer._id,
            name: viewer.name,
            role: viewer.role === 'admin' ? 'admin' : 'student',
            semester: viewer.semester ?? null,
          }
          : undefined,
      });
      await loadDiscussion(true);
    } catch (actionError) {
      const message = getErrorMessage(actionError, 'Could not create the discussion post.');
      setError(message);
      throw actionError;
    }
  };

  const updatePost = async (postId: string, body: string) => {
    try {
      setError('');
      await discussionApi.updatePost(postId, body);
      await loadDiscussion(true);
    } catch (actionError) {
      const message = getErrorMessage(actionError, 'Could not update the discussion post.');
      setError(message);
      throw actionError;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setError('');
      await discussionApi.deletePost(postId);
      await loadDiscussion(true);
    } catch (actionError) {
      const message = getErrorMessage(actionError, 'Could not delete the discussion post.');
      setError(message);
      throw actionError;
    }
  };

  if (!request) return null;

  const posts = discussion
    ? (isChat ? [...discussion.posts].reverse() : discussion.posts)
    : [];

  if (isChat) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <MessageSquareText className="h-4.5 w-4.5" />
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-black text-slate-900">{title}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                <Users className="h-3 w-3" />
                Open room
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-600">
              {discussion?.thread.postCount || 0} messages
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadDiscussion(true)}
              disabled={refreshing}
              className="h-9 rounded-full px-3 text-xs font-semibold normal-case tracking-normal"
            >
              {refreshing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </div>

        {error ? (
          <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid h-[66vh] min-h-[420px] grid-rows-[1fr_auto] bg-[#efeae2]">
          <div ref={messageListRef} className="overflow-y-auto px-3 py-3 sm:px-4">
            {loading && !discussion ? (
              <div className="flex h-full min-h-[260px] items-center justify-center text-sm font-medium text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading messages...
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-3">
                {posts.map((post) => (
                  <DiscussionPostCard
                    key={post._id}
                    post={post}
                    onReply={(parentId, body) => createPost(body, parentId)}
                    onUpdate={updatePost}
                    onDelete={deletePost}
                    variant="chat"
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-[260px] items-center justify-center">
                <div className="max-w-sm rounded-[1.4rem] border border-dashed border-slate-300 bg-white px-5 py-6 text-center shadow-sm">
                  <p className="text-sm font-black text-slate-800">No messages yet</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    {emptyStateDescription}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:p-4">
            <DiscussionComposer
              onSubmit={(body) => createPost(body)}
              placeholder={composerPlaceholder}
              submitLabel={submitLabel}
              variant="chat"
              compact
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600">
              {discussion?.thread.postCount || 0} posts
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => loadDiscussion(true)}
              disabled={refreshing}
              className="rounded-xl px-3 normal-case tracking-normal"
            >
              {refreshing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
              Refresh
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <DiscussionComposer
            onSubmit={(body) => createPost(body)}
            placeholder={composerPlaceholder}
            submitLabel={submitLabel}
            variant="board"
          />
        </div>

        {loading && !discussion ? (
          <div className="mt-6 flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-sm font-medium text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading discussion...
          </div>
        ) : posts.length > 0 ? (
          <div className="mt-6 space-y-4">
            {posts.map((post) => (
              <DiscussionPostCard
                key={post._id}
                post={post}
                onReply={(parentId, body) => createPost(body, parentId)}
                onUpdate={updatePost}
                onDelete={deletePost}
                variant="board"
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
            <p className="text-sm font-black text-slate-700">No discussion yet</p>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {emptyStateDescription}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
