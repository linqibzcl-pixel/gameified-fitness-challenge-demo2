import type { SetRecord } from '../../lib/types';
import { estimateVolumeKcal, type ExerciseDefinition } from '../../lib/exercises';
import { KCAL_PER_COMPLETED_SET, theme } from '../../theme';

interface Props {
  exercise: ExerciseDefinition;
  sets: SetRecord[];
  weightKg: number;
}

export default function SetHistoryPanel({ exercise, sets, weightKg }: Props) {
  if (sets.length === 0) return null;

  const unit = exercise.mode === 'reps' ? '次' : '秒';

  return (
    <div
      className="rounded-[20px] p-4 w-full"
      style={{
        background: 'rgba(28, 28, 30, 0.85)',
        border: `1px solid ${theme.surfaceBorder}`,
      }}
    >
      <div className="text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: theme.textSecondary }}>
        本组记录
      </div>
      <div className="space-y-2 max-h-44 overflow-y-auto">
        {[...sets].reverse().map((s, i) => {
          const idx = sets.length - i;
          const k =
            Math.round((estimateVolumeKcal(s.reps, weightKg, exercise) + KCAL_PER_COMPLETED_SET) * 10) / 10;
          return (
            <div
              key={`${idx}-${s.timestamp.getTime()}`}
              className="flex items-center justify-between py-2.5 px-3 rounded-[12px]"
              style={{ background: 'rgba(0,0,0,0.25)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: theme.accentMuted, color: theme.accent }}
                >
                  {idx}
                </div>
                <span className="text-[15px] font-semibold" style={{ color: theme.text }}>
                  {s.reps} {unit}
                </span>
              </div>
              <span className="text-[11px] tabular-nums font-medium" style={{ color: theme.textSecondary }}>
                约 {k} kcal · {s.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
