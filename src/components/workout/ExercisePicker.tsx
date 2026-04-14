import { EXERCISES, type ExerciseId } from '../../lib/exercises';
import { theme } from '../../theme';

interface Props {
  selectedId: ExerciseId;
  onSelect: (id: ExerciseId) => void;
}

export default function ExercisePicker({ selectedId, onSelect }: Props) {
  return (
    <div
      className="rounded-[20px] p-3 mb-4 w-full"
      style={{
        background: 'rgba(28, 28, 30, 0.85)',
        border: `1px solid ${theme.surfaceBorder}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div className="text-[10px] uppercase tracking-wider font-semibold mb-2.5 px-0.5" style={{ color: theme.textSecondary }}>
        选择动作
      </div>
      <div className="grid grid-cols-2 gap-2">
        {EXERCISES.map(ex => {
          const Icon = ex.icon;
          const selected = ex.id === selectedId;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => onSelect(ex.id)}
              className="flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-left transition-all"
              style={{
                background: selected ? theme.accentMuted : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selected ? theme.accentBorder : theme.surfaceBorder}`,
                color: selected ? theme.accentBright : theme.textSecondary,
              }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{
                  background: selected ? 'rgba(48, 209, 88, 0.22)' : 'rgba(0,0,0,0.35)',
                  color: selected ? theme.accentBright : theme.textTertiary,
                }}
              >
                <Icon size={18} strokeWidth={2.25} />
              </span>
              <span className="text-[14px] font-semibold leading-tight" style={{ color: selected ? theme.text : theme.text }}>
                {ex.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
