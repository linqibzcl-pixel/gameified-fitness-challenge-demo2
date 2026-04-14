import type { ExerciseId } from '../lib/exercises';
import SquatFigure from './SquatFigure';
import { theme } from '../theme';

interface Props {
  exerciseId: ExerciseId;
  motionActive: boolean;
  isActive: boolean;
}

/** 深蹲保留原有 SVG 动画；其余动作用主题色线框图标，便于配置扩展。 */
export default function ExerciseVisual({ exerciseId, motionActive, isActive }: Props) {
  if (exerciseId === 'squat') {
    return <SquatFigure isSquatting={motionActive} isActive={isActive} />;
  }

  const color = isActive ? theme.accent : theme.textTertiary;
  const glow = isActive ? 'rgba(48, 209, 88, 0.35)' : 'transparent';

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: 160,
        height: 240,
        filter: isActive ? `drop-shadow(0 0 14px ${glow})` : 'none',
        transition: 'filter 0.3s ease',
      }}
    >
      <svg viewBox="0 0 100 100" width={112} height={112} aria-hidden>
        {exerciseId === 'pushup' && (
          <>
            <circle cx="50" cy="22" r="9" fill="none" stroke={color} strokeWidth="3.5" />
            <path
              d="M50 31 L50 48 M32 40 L68 40 M50 48 L38 72 M50 48 L62 72 M32 78 L22 88 M68 78 L78 88"
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: motionActive ? 'translateY(4px)' : 'translateY(0)',
                transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </>
        )}
        {exerciseId === 'jumping_jack' && (
          <>
            <circle cx="50" cy="18" r="8" fill="none" stroke={color} strokeWidth="3.5" />
            <path
              d="M50 26 L50 52 M50 52 L40 78 M50 52 L60 78 M50 40 L28 32 M50 40 L72 32 M40 78 L34 92 M60 78 L66 92"
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
              style={{
                transform: motionActive ? 'scaleY(0.92)' : 'scaleY(1)',
                transformOrigin: '50% 50%',
                transition: 'transform 0.2s ease',
              }}
            />
          </>
        )}
        {exerciseId === 'plank' && (
          <>
            <circle cx="72" cy="28" r="7" fill="none" stroke={color} strokeWidth="3.5" />
            <path
              d="M65 34 L28 42 L18 58 M28 42 L28 62 M40 44 L40 70"
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: motionActive ? 0.85 : 1,
                transition: 'opacity 0.3s ease',
              }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
