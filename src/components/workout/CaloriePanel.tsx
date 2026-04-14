import { Scale } from 'lucide-react';
import type { ExerciseDefinition } from '../../lib/exercises';
import { theme } from '../../theme';

interface Props {
  exercise: ExerciseDefinition;
  weightKg: number;
  currentSetVolume: number;
  completedSets: number;
  setVolumeOnlyKcal: number;
  setBonusKcal: number;
  sessionKcal: number;
}

export default function CaloriePanel({
  exercise,
  weightKg,
  currentSetVolume,
  completedSets,
  setVolumeOnlyKcal,
  setBonusKcal,
  sessionKcal,
}: Props) {
  const unit = exercise.mode === 'reps' ? '次' : '秒';
  const volumeLabel = exercise.mode === 'reps' ? '本组次数' : '本组时长';
  const basisLabel = exercise.mode === 'reps' ? '本组 · 按次数' : '本组 · 按秒';
  const footnote =
    exercise.mode === 'reps'
      ? '次数 × 体重系数 + 每组固定消耗，仅供参考'
      : '支撑秒数 × 体重系数 + 每组固定消耗，仅供参考';

  return (
    <div
      className="rounded-[20px] px-4 py-3 min-w-[158px] max-w-[200px]"
      style={{
        background: 'rgba(0,0,0,0.4)',
        border: `1px solid ${theme.surfaceBorder}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-2 mb-2" style={{ color: theme.accent }}>
        <Scale size={16} strokeWidth={2.25} />
        <span className="text-[10px] font-bold uppercase tracking-widest">动态卡路里</span>
      </div>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider" style={{ color: theme.textTertiary }}>
          体重 (kg)
        </span>
        <span className="text-[14px] font-bold tabular-nums" style={{ color: theme.text }}>
          {Number.isInteger(weightKg) ? weightKg : weightKg.toFixed(1)}
        </span>
      </div>
      <div className="space-y-2 text-[11px]">
        <div className="flex justify-between gap-2">
          <span style={{ color: theme.textSecondary }}>{volumeLabel}</span>
          <span className="font-semibold tabular-nums" style={{ color: theme.text }}>
            {currentSetVolume} {unit}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span style={{ color: theme.textSecondary }}>{basisLabel}</span>
          <span className="font-bold tabular-nums" style={{ color: theme.accentBright }}>
            {setVolumeOnlyKcal} kcal
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span style={{ color: theme.textSecondary }}>已完成 {completedSets} 组</span>
          <span className="font-semibold tabular-nums" style={{ color: theme.accent }}>
            +{setBonusKcal} kcal
          </span>
        </div>
        <div
          className="flex justify-between gap-2 pt-2 mt-1"
          style={{ borderTop: `1px solid ${theme.surfaceBorder}` }}
        >
          <span style={{ color: theme.textSecondary }}>本次合计</span>
          <span className="font-bold tabular-nums text-[13px]" style={{ color: theme.text }}>
            {sessionKcal} kcal
          </span>
        </div>
      </div>
      <p className="text-[9px] mt-2 leading-snug" style={{ color: theme.textTertiary }}>
        {footnote}
      </p>
    </div>
  );
}
