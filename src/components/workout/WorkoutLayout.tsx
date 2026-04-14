import type { ReactNode } from 'react';
import { theme } from '../../theme';

export default function WorkoutLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-4 pt-6 pb-14 antialiased"
      style={{ background: theme.fitnessHeroGradient }}
    >
      {children}
    </div>
  );
}
