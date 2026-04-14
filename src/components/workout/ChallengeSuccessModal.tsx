import { useEffect } from 'react';
import type { ChallengeResult } from '../../lib/types';
import { theme } from '../../theme';

interface Props {
  open: boolean;
  result: ChallengeResult | null;
  onClose: () => void;
  onAgain: () => void;
}

export default function ChallengeSuccessModal({ open, result, onClose, onAgain }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !result) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-success-title"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-[24px] p-5 shadow-2xl"
        style={{
          background: 'rgba(28, 28, 30, 0.96)',
          border: `1px solid ${theme.surfaceBorder}`,
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="challenge-success-title" className="text-[18px] font-bold text-center mb-5" style={{ color: theme.text }}>
          今日挑战成功
        </h2>

        <div className="space-y-3 mb-6">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: theme.textTertiary }}>
              本次挑战得分
            </span>
            <span className="text-[22px] font-bold tabular-nums" style={{ color: theme.accentBright }}>
              {result.score}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: theme.textTertiary }}>
              完成度
            </span>
            <span className="text-[22px] font-bold tabular-nums" style={{ color: theme.text }}>
              {result.completionRate}%
            </span>
          </div>
          <div
            className="rounded-[12px] px-3 py-2.5 text-center text-[14px] font-semibold"
            style={{
              background: theme.accentMuted,
              border: `1px solid ${theme.accentBorder}`,
              color: theme.accentBright,
            }}
          >
            {result.badgeText}
          </div>
          {result.starLevel > 0 ? (
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[20px] tracking-widest" style={{ color: theme.accentBright }} aria-hidden>
                {'★'.repeat(result.starLevel)}
              </span>
              <span className="text-[13px] font-medium" style={{ color: theme.textSecondary }}>
                {result.starLevel} 星
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onAgain}
            className="w-full rounded-[14px] py-3.5 font-semibold text-[14px]"
            style={{
              background: 'rgba(48, 209, 88, 0.12)',
              color: theme.accentBright,
              border: `1px solid ${theme.accentBorder}`,
            }}
          >
            再来一组
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[14px] py-3 font-semibold text-[13px] uppercase tracking-wide"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: theme.textSecondary,
              border: `1px solid ${theme.surfaceBorder}`,
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
