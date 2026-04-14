import { Activity, Flame, Timer } from 'lucide-react';
import { theme } from '../../theme';

interface Props {
  setsDone: number;
  sessionKcal: number;
  sessionTimeLabel: string;
  lifetimeTimeLabel: string;
}

export default function SessionSummaryRings({
  setsDone,
  sessionKcal,
  sessionTimeLabel,
  lifetimeTimeLabel,
}: Props) {
  const items = [
    {
      label: '组数',
      value: String(setsDone),
      sub: '已完成',
      icon: <Activity size={18} strokeWidth={2.25} />,
      ring: theme.accent,
    },
    {
      label: '活动',
      value: sessionKcal.toFixed(1),
      sub: '千卡 · 本次',
      icon: <Flame size={18} strokeWidth={2.25} />,
      ring: '#fa114f',
    },
    {
      label: '时间',
      value: sessionTimeLabel,
      sub: `累计 ${lifetimeTimeLabel}`,
      icon: <Timer size={18} strokeWidth={2.25} />,
      ring: '#9b59ff',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-md">
      {items.map(({ label, value, sub, icon, ring }) => (
        <div
          key={label}
          className="rounded-[22px] px-2 py-3 text-center relative overflow-hidden"
          style={{
            background: 'rgba(28, 28, 30, 0.92)',
            border: `1px solid ${theme.surfaceBorder}`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full opacity-90"
            style={{ background: ring, boxShadow: `0 0 12px ${ring}55` }}
          />
          <div className="flex justify-center mt-2 mb-1" style={{ color: ring }}>
            {icon}
          </div>
          <div className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: theme.textSecondary }}>
            {label}
          </div>
          <div className="text-lg font-bold tabular-nums leading-tight" style={{ color: theme.text }}>
            {value}
          </div>
          <div className="text-[9px] mt-0.5 leading-tight px-1" style={{ color: theme.textTertiary }}>
            {sub}
          </div>
        </div>
      ))}
    </div>
  );
}
