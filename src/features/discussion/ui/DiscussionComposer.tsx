'use client';

import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface DiscussionComposerProps {
  onSubmit: (body: string) => Promise<void>;
  placeholder: string;
  submitLabel: string;
  onCancel?: () => void;
  autoFocus?: boolean;
  compact?: boolean;
  variant?: 'board' | 'chat';
}

export const DiscussionComposer = ({
  onSubmit,
  placeholder,
  submitLabel,
  onCancel,
  autoFocus = false,
  compact = false,
  variant = 'board',
}: DiscussionComposerProps) => {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setBody('');
      onCancel?.();
    } finally {
      setSubmitting(false);
    }
  };

  const isChat = variant === 'chat';

  return (
    <form onSubmit={handleSubmit} className={isChat ? 'space-y-1.5' : 'space-y-3'}>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={placeholder}
        maxLength={1000}
        autoFocus={autoFocus}
        className={`w-full resize-none border px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 ${
          isChat
            ? `rounded-[1.35rem] border-slate-300 bg-slate-50 leading-5 focus:bg-white ${compact ? 'min-h-[44px]' : 'min-h-[52px]'}`
            : `rounded-2xl border-slate-200 bg-white ${compact ? 'min-h-[100px]' : 'min-h-[130px]'}`
        }`}
      />
      <div className={`flex gap-3 ${isChat ? 'items-center justify-between' : 'flex-col sm:flex-row sm:items-center sm:justify-between'}`}>
        <p className={`text-xs font-bold ${isChat ? 'tracking-normal text-slate-500' : 'uppercase tracking-[0.16em] text-slate-400'}`}>
          {body.trim().length}/1000 characters
        </p>
        <div className="flex items-center gap-2">
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className={`normal-case tracking-normal ${isChat ? 'h-8 rounded-full px-3 text-xs font-semibold' : 'rounded-xl px-4'}`}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            size="sm"
            disabled={submitting || !body.trim()}
            className={`normal-case tracking-normal ${isChat ? 'h-9 rounded-full px-4 text-xs font-semibold' : 'rounded-xl px-4'}`}
          >
            {isChat ? <SendHorizontal className="mr-1.5 h-3.5 w-3.5" /> : null}
            {submitting ? 'Posting...' : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};
