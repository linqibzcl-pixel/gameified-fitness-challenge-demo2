import { RotateCcw, Play, Pause, CheckCircle2 } from 'lucide-react';
import type { ExerciseMode } from '../../lib/exercises';
import { theme } from '../../theme';

interface Props {
  mode: ExerciseMode;
  resting: boolean;
  isActive: boolean;
  flash: boolean;
  onCount: () => void;
  onToggleActive: () => void;
  onReset: () => void;
  onSave: () => void;
  canSave: boolean;
}

export default function WorkoutControls({
  mode,
  resting,
  isActive,
  flash,
  onCount,
  onToggleActive,
  onReset,
  onSave,
  canSave,
}: Props) {
  const tapEnabled = mode === 'reps' && isActive && !resting;

  const primaryLabel = resting
    ? '休息中…'
    : mode === 'time'
      ? isActive
        ? '计时进行中…'
        : '开始训练后自动计时'
      : isActive
        ? '点按计数'
        : '开始训练后点按';

  return (
    <>
      <button
        type="button"
        onClick={onCount}
        disabled={!tapEnabled}
        className="w-full rounded-[20px] font-bold text-[17px] mb-3 relative overflow-hidden transition-all duration-150 min-h-[64px] tracking-wide"
        style={{
          background: tapEnabled
            ? `linear-gradient(145deg, #1f7a35 0%, ${theme.accent} 48%, ${theme.accentBright} 100%)`
            : 'rgba(255,255,255,0.06)',
          color: tapEnabled ? '#0a0a0a' : theme.textTertiary,
          border: tapEnabled ? 'none' : `1px solid ${theme.surfaceBorder}`,
          transform: flash ? 'scale(0.98)' : 'scale(1)',
          boxShadow: tapEnabled ? '0 12px 40px rgba(48, 209, 88, 0.35)' : 'none',
          cursor: tapEnabled ? 'pointer' : 'not-allowed',
        }}
      >
        {primaryLabel}
      </button>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={onToggleActive}
          className="flex-1 rounded-[14px] py-3 flex items-center justify-center gap-2 font-semibold text-[13px] uppercase tracking-wide"
          style={{
            background: isActive ? 'rgba(250, 17, 79, 0.12)' : theme.accentMuted,
            color: isActive ? '#ff6482' : theme.accent,
            border: `1px solid ${isActive ? 'rgba(250,17,79,0.28)' : theme.accentBorder}`,
          }}
        >
          {isActive ? <Pause size={17} /> : <Play size={17} />}
          {isActive ? '暂停' : '开始'}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-[14px] py-3 flex items-center justify-center gap-2 font-semibold text-[13px] uppercase tracking-wide"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: theme.textSecondary,
            border: `1px solid ${theme.surfaceBorder}`,
          }}
        >
          <RotateCcw size={17} />
          重置
        </button>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={!canSave}
        className="w-full rounded-[14px] py-3.5 flex items-center justify-center gap-2 font-semibold text-[14px] transition-opacity"
        style={{
          background: canSave ? 'rgba(48, 209, 88, 0.12)' : 'rgba(255,255,255,0.04)',
          color: canSave ? theme.accentBright : theme.textTertiary,
          border: `1px solid ${canSave ? theme.accentBorder : theme.surfaceBorder}`,
          opacity: canSave ? 1 : 0.5,
          cursor: canSave ? 'pointer' : 'not-allowed',
        }}
      >
        <CheckCircle2 size={18} strokeWidth={2.25} />
        完成并保存到本地
      </button>
    </>
  );
}
