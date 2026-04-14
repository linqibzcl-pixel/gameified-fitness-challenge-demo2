import type { ExerciseMode } from '../../lib/exercises';
import { theme } from '../../theme';

interface Props {
  mode: ExerciseMode;
  options: readonly number[];
  targetReps: number;
  onSelect: (n: number) => void;
}

export default function TargetRepsPicker({ mode, options, targetReps, onSelect }: Props) {
  const title = mode === 'reps' ? '每组目标次数' : '每组目标时长';
  const unit = mode === 'reps' ? '次' : '秒';

  return (
    <div
      className="rounded-[20px] p-4 mb-6 w-full"
      style={{
        background: 'rgba(28, 28, 30, 0.85)',
        border: `1px solid ${theme.surfaceBorder}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: theme.textSecondary }}>
        {title}
      </div>
      <div className="flex gap-2">
        {options.map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onSelect(n)}
            className="flex-1 py-2.5 rounded-[12px] font-semibold text-[14px] transition-all"
            style={{
              background: targetReps === n ? theme.accentMuted : 'rgba(255,255,255,0.05)',
              color: targetReps === n ? theme.accent : theme.textTertiary,
              border: `1px solid ${targetReps === n ? theme.accentBorder : theme.surfaceBorder}`,
            }}
          >
            {mode === 'time' ? `${n}s` : n}
          </button>
        ))}
      </div>
      {mode === 'time' && (
        <p className="text-[10px] mt-2.5" style={{ color: theme.textTertiary }}>
          单位：{unit}；开始训练后自动累计
        </p>
      )}
    </div>
  );
}
