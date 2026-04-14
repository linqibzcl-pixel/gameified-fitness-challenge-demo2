import ExerciseVisual from '../ExerciseVisual';
import ProgressRing from '../ProgressRing';
import CaloriePanel from './CaloriePanel';
import type { ExerciseDefinition } from '../../lib/exercises';
import { theme } from '../../theme';

interface Props {
  exercise: ExerciseDefinition;
  setComplete: boolean;
  targetReps: number;
  resting: boolean;
  restTimer: number;
  onSkipRest: () => void;
  isSquatting: boolean;
  isActive: boolean;
  count: number;
  flash: boolean;
  progress: number;
  setsLength: number;
  weightKg: number;
  setRepsOnlyKcal: number;
  setBonusSoFar: number;
  sessionKcal: number;
  completedSets: number;
}

export default function WorkoutSessionCard({
  exercise,
  setComplete,
  targetReps,
  resting,
  restTimer,
  onSkipRest,
  isSquatting,
  isActive,
  count,
  flash,
  progress,
  setsLength,
  weightKg,
  setRepsOnlyKcal,
  setBonusSoFar,
  sessionKcal,
  completedSets,
}: Props) {
  const unit = exercise.mode === 'reps' ? '次' : '秒';
  const targetLine = `/ ${targetReps} ${unit}`;

  return (
    <div
      className="rounded-[28px] p-6 mb-5 relative overflow-hidden w-full"
      style={{
        background: 'rgba(28, 28, 30, 0.85)',
        border: `1px solid ${theme.surfaceBorder}`,
        boxShadow: '0 24px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {setComplete && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 rounded-[28px]"
          style={{ background: 'rgba(48, 209, 88, 0.14)', backdropFilter: 'blur(3px)' }}
        >
          <div className="text-center px-4">
            <div className="text-[32px] font-bold mb-1" style={{ color: theme.accentBright }}>
              本组完成
            </div>
            <div className="text-[15px] font-medium" style={{ color: theme.textSecondary }}>
              {targetReps} {unit} · {exercise.name}
            </div>
          </div>
        </div>
      )}

      {resting && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 rounded-[28px]"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
        >
          <div className="text-center">
            <div className="text-[13px] uppercase tracking-[0.2em] mb-2 font-semibold" style={{ color: theme.textSecondary }}>
              休息
            </div>
            <div className="text-[56px] font-bold tabular-nums mb-4" style={{ color: theme.text }}>
              {restTimer}
              <span className="text-2xl align-super ml-0.5">s</span>
            </div>
            <button
              type="button"
              onClick={onSkipRest}
              className="px-7 py-2.5 rounded-[14px] text-[13px] font-bold uppercase tracking-wider"
              style={{
                background: theme.accentMuted,
                color: theme.accent,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              跳过
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:items-start">
        <ExerciseVisual exerciseId={exercise.id} motionActive={isSquatting} isActive={isActive && !resting} />

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row items-center gap-4 flex-wrap justify-center">
            <ProgressRing
              progress={progress}
              size={168}
              strokeWidth={9}
              color={theme.accent}
              trailColor="rgba(255,255,255,0.07)"
            >
              <div className="text-center">
                <div
                  className="font-bold leading-none transition-all duration-150 tabular-nums"
                  style={{
                    fontSize: count >= 100 ? '44px' : '56px',
                    letterSpacing: '-0.02em',
                    color: flash ? theme.accent : theme.text,
                    transform: flash ? 'scale(1.08)' : 'scale(1)',
                    transition: 'color 0.15s, transform 0.15s',
                  }}
                >
                  {count}
                </div>
                <div className="text-[12px] mt-1 font-medium" style={{ color: theme.textSecondary }}>
                  {targetLine}
                </div>
              </div>
            </ProgressRing>

            <CaloriePanel
              exercise={exercise}
              weightKg={weightKg}
              currentSetVolume={count}
              completedSets={completedSets}
              setVolumeOnlyKcal={setRepsOnlyKcal}
              setBonusKcal={setBonusSoFar}
              sessionKcal={sessionKcal}
            />
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.textSecondary }}>
              当前组
            </div>
            <div className="text-[26px] font-bold tabular-nums" style={{ color: theme.text }}>
              {setsLength + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
