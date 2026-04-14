import { useMemo } from 'react';
import { History } from 'lucide-react';
import type { TrainingHistoryEntry } from '../../lib/types';
import { EXERCISES } from '../../lib/exercises';
import { theme } from '../../theme';

const PREVIEW_COUNT = 10;

interface Props {
  entries: TrainingHistoryEntry[];
}

function exerciseName(id: string): string {
  return EXERCISES.find(e => e.id === id)?.name ?? id;
}

export default function TrainingHistoryPanel({ entries }: Props) {
  const recent = useMemo(() => [...entries].reverse().slice(0, PREVIEW_COUNT), [entries]);

  return (
    <div
      className="rounded-[20px] p-4 w-full mt-5"
      style={{
        background: 'rgba(28, 28, 30, 0.85)',
        border: `1px solid ${theme.surfaceBorder}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <History size={16} strokeWidth={2.25} style={{ color: theme.accent }} />
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: theme.textSecondary }}>
          最近训练记录
        </span>
        <span className="text-[10px] ml-auto" style={{ color: theme.textTertiary }}>
          每组完成时自动保存
        </span>
      </div>

      {recent.length === 0 ? (
        <p className="text-[13px] py-2 text-center font-medium" style={{ color: theme.textSecondary }}>
          暂无记录，完成一组目标后即会出现在此
        </p>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto">
          {recent.map(h => {
            const unit = h.mode === 'time' ? '秒' : '次';
            const timeLabel = new Date(h.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div
                key={h.id}
                className="rounded-[12px] px-3 py-2.5 text-[12px]"
                style={{ background: 'rgba(0,0,0,0.28)', border: `1px solid ${theme.surfaceBorder}` }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold" style={{ color: theme.accentBright }}>
                    {exerciseName(h.exerciseId)}
                  </span>
                  <span className="tabular-nums shrink-0" style={{ color: theme.textTertiary }}>
                    {timeLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  <span style={{ color: theme.textSecondary }}>完成 / 目标</span>
                  <span className="text-right font-semibold tabular-nums" style={{ color: theme.text }}>
                    {h.completedValue} {unit} / {h.targetValue} {unit}
                  </span>
                  <span style={{ color: theme.textSecondary }}>达标</span>
                  <span
                    className="text-right font-semibold"
                    style={{ color: h.completed ? theme.accentBright : '#ff6482' }}
                  >
                    {h.completed ? '是' : '否'}
                  </span>
                  <span style={{ color: theme.textSecondary }}>本组消耗</span>
                  <span className="text-right font-semibold tabular-nums" style={{ color: theme.accent }}>
                    {h.estimatedKcal} kcal
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
