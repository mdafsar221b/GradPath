'use client';

import { useMemo, useState } from 'react';
import { MessageSquareReply, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/use-auth-store';
import { Button } from '@/shared/ui/Button';
import { DiscussionComposer } from './DiscussionComposer';
import { DiscussionPost, DiscussionReply } from '../model/discussion.types';

interface DiscussionPostCardProps {
  post: DiscussionPost | DiscussionReply;
  onReply?: (parentId: string, body: string) => Promise<void>;
  onUpdate: (postId: string, body: string) => Promise<void>;
  onDelete: (postId: string) => Promise<void>;
  isReply?: boolean;
  variant?: 'board' | 'chat';
}

const formatDate = (value: string) => new Date(value).toLocaleString();

const formatChatTime = (value: string) => new Date(value).toLocaleString([], {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const getInitials = (name: string) => (
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'S'
);

export const DiscussionPostCard = ({
  post,
  onReply,
  onUpdate,
  onDelete,
  isReply = false,
  variant = 'board',
}: DiscussionPostCardProps) => {
  const viewer = useAuthStore((state) => state.user);
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const badges = useMemo(() => {
    if (post.author.role === 'admin') {
      return [{ label: 'Admin', className: 'bg-slate-900 text-white' }];
    }

    const items = [];

    if (typeof post.author.semester === 'number') {
      items.push({
        label: `Semester ${post.author.semester}`,
        className: 'bg-blue-50 text-blue-700',
      });
    }

    if (
      viewer?.role === 'student'
      && typeof viewer.semester === 'number'
      && typeof post.author.semester === 'number'
      && post.author.semester > viewer.semester
    ) {
      items.push({
        label: 'Senior',
        className: 'bg-emerald-50 text-emerald-700',
      });
    }

    return items;
  }, [post.author.role, post.author.semester, viewer?.role, viewer?.semester]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this discussion post?')) return;
    setDeleting(true);
    try {
      await onDelete(post._id);
    } finally {
      setDeleting(false);
    }
  };

  const replies = 'replies' in post ? post.replies : [];
  const isChat = variant === 'chat';
  const isOwnMessage = String(viewer?._id || '') === String(post.author._id || '');
  const avatarInitials = getInitials(post.author.name);

  if (isChat) {
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`flex items-end gap-2 ${
            isOwnMessage ? 'flex-row-reverse' : 'flex-row'
          } ${isReply ? 'max-w-[82vw] sm:max-w-[62%] xl:max-w-[28rem]' : 'max-w-[88vw] sm:max-w-[72%] xl:max-w-[34rem]'}`}
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
              post.author.role === 'admin'
                ? 'bg-slate-900 text-white'
                : isOwnMessage
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-200 text-slate-700'
            }`}
          >
            {avatarInitials}
          </div>

          <div className={`flex min-w-0 max-w-full flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-full px-3 py-2 shadow-sm relative ${
                isOwnMessage
                  ? 'rounded-l-xl rounded-tr-xl rounded-br-sm bg-[#d9fdd3] text-gray-900'
                  : 'rounded-r-xl rounded-tl-xl rounded-bl-sm bg-white text-gray-900'
              } ${post.isDeleted ? 'opacity-70' : ''}`}
            >
              {!isOwnMessage && (
                <div className={`mb-1 flex flex-wrap items-center gap-1.5 justify-start`}>
                  <p className={`text-[11px] font-bold ${post.isDeleted ? 'text-slate-600' : 'text-blue-600'}`}>
                    {post.author.name}
                  </p>
                  {badges.map((badge) => (
                    <span
                      key={badge.label}
                      className={`rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                  {post.isDeleted ? (
                    <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-rose-700">
                      Deleted
                    </span>
                  ) : null}
                </div>
              )}

              {isEditing ? (
                <DiscussionComposer
                  onSubmit={async (body) => {
                    await onUpdate(post._id, body);
                    setIsEditing(false);
                  }}
                  placeholder="Edit your message"
                  submitLabel="Save"
                  onCancel={() => setIsEditing(false)}
                  compact
                  autoFocus
                  variant="chat"
                />
              ) : post.isDeleted ? (
                <p className="text-xs italic text-slate-500">This message was deleted.</p>
              ) : (
                <div className="flex flex-col">
                  <p className={`whitespace-pre-wrap break-words text-[14px] leading-snug text-gray-900`}>
                    {post.body}
                  </p>
                  <span className={`text-[10px] text-gray-500 self-end mt-1`}>
                    {formatChatTime(post.createdAt)}
                    {post.editedAt ? ' | Edited' : ''}
                  </span>
                </div>
              )}
            </div>

            {!post.isDeleted ? (
              <div className={`mt-1 flex flex-wrap items-center gap-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                {onReply && !isReply ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReplyComposer((current) => !current)}
                    className={`h-7 rounded-full px-2.5 text-[11px] font-semibold normal-case tracking-normal ${
                      isOwnMessage
                        ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <MessageSquareReply className="mr-1 h-3.5 w-3.5" />
                    Reply
                  </Button>
                ) : null}
                {post.canEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing((current) => !current)}
                    className="h-7 rounded-full px-2.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 normal-case tracking-normal"
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                ) : null}
                {post.canDelete ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="h-7 rounded-full px-2.5 text-[11px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 normal-case tracking-normal"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    {deleting ? 'Deleting...' : 'Delete'}
                  </Button>
                ) : null}
              </div>
            ) : null}

            {showReplyComposer && onReply ? (
              <div className="mt-2 w-full max-w-full rounded-[1rem] border border-slate-200 bg-white p-2 shadow-sm">
                <DiscussionComposer
                  onSubmit={(body) => onReply(post._id, body)}
                  placeholder="Write a reply"
                  submitLabel="Send reply"
                  onCancel={() => setShowReplyComposer(false)}
                  compact
                  autoFocus
                  variant="chat"
                />
              </div>
            ) : null}

            {replies.length > 0 ? (
              <div className={`mt-2 w-full space-y-2 border-l border-slate-200 pl-2.5 ${isOwnMessage ? 'pr-1' : ''}`}>
                {replies.map((reply) => (
                  <DiscussionPostCard
                    key={reply._id}
                    post={reply}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    isReply
                    variant="chat"
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${isReply ? 'shadow-none' : 'shadow-sm'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-slate-900">{post.author.name}</p>
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
            {post.isDeleted ? (
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-rose-700">
                Deleted
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs font-medium text-slate-400">
            {formatDate(post.createdAt)}
            {post.editedAt ? ' | Edited' : ''}
          </p>
        </div>

        {!post.isDeleted ? (
          <div className="flex flex-wrap gap-2">
            {onReply && !isReply ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyComposer((current) => !current)}
                className="rounded-xl px-3 normal-case tracking-normal"
              >
                <MessageSquareReply className="mr-1.5 h-4 w-4" />
                Reply
              </Button>
            ) : null}
            {post.canEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing((current) => !current)}
                className="rounded-xl px-3 normal-case tracking-normal"
              >
                <Pencil className="mr-1.5 h-4 w-4" />
                Edit
              </Button>
            ) : null}
            {post.canDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl px-3 text-red-600 hover:bg-red-50 hover:text-red-700 normal-case tracking-normal"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        {isEditing ? (
          <DiscussionComposer
            onSubmit={async (body) => {
              await onUpdate(post._id, body);
              setIsEditing(false);
            }}
            placeholder="Edit your post"
            submitLabel="Save changes"
            onCancel={() => setIsEditing(false)}
            compact
            autoFocus
            variant="board"
          />
        ) : post.isDeleted ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium italic text-slate-500">
            This post was deleted.
          </p>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{post.body}</p>
        )}
      </div>

      {showReplyComposer && onReply ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <DiscussionComposer
            onSubmit={(body) => onReply(post._id, body)}
            placeholder="Write a reply for this discussion"
            submitLabel="Post reply"
            onCancel={() => setShowReplyComposer(false)}
            compact
            autoFocus
            variant="board"
          />
        </div>
      ) : null}

      {replies.length > 0 ? (
        <div className="mt-5 space-y-3 border-l-2 border-slate-100 pl-4">
          {replies.map((reply) => (
            <DiscussionPostCard
              key={reply._id}
              post={reply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isReply
              variant="board"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
