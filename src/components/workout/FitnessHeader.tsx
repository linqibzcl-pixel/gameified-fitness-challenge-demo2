import { useState } from 'react';
import { Settings } from 'lucide-react';
import { theme } from '../../theme';
import SettingsModal from './SettingsModal';

interface Props {
  exerciseName: string;
  weightKg: number;
  onWeightKgChange: (kg: number) => void;
}

export default function FitnessHeader({ exerciseName, weightKg, onWeightKgChange }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full max-w-md mb-6 relative text-center">
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="absolute right-0 top-0 p-2 rounded-[12px] -mr-1"
        style={{
          color: theme.textSecondary,
          border: `1px solid ${theme.surfaceBorder}`,
          background: 'rgba(0,0,0,0.25)',
        }}
        aria-label="打开设置"
      >
        <Settings size={20} strokeWidth={2} />
      </button>

      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: theme.textSecondary }}>
        Fitness
      </p>
      <h1 className="text-[34px] font-bold tracking-tight leading-tight" style={{ color: theme.text }}>
        {exerciseName}
      </h1>
      <p className="text-[15px] mt-1 font-medium" style={{ color: theme.textSecondary }}>
        {today}
      </p>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        weightKg={weightKg}
        onWeightKgChange={onWeightKgChange}
      />
    </header>
  );
}
