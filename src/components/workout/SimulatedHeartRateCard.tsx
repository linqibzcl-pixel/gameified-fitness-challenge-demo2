import { Heart } from 'lucide-react';
import { theme } from '../../theme';

const HR_RING = '#ff375f';

interface Props {
  bpm: number;
  /** 强度区间或准备态文案 */
  zoneLabel: string;
  /** 是否正在实时推进模拟（开始且非休息） */
  isSimulationRunning: boolean;
  /** 是否已在本页按过开始（区分未开始 vs 暂停） */
  sessionStarted: boolean;
}

export default function SimulatedHeartRateCard({
  bpm,
  zoneLabel,
  isSimulationRunning,
  sessionStarted,
}: Props) {
  return (
    <div
      className="rounded-[22px] px-4 py-3 mb-6 w-full max-w-md relative overflow-hidden"
      style={{
        background: 'rgba(28, 28, 30, 0.92)',
        border: `1px solid ${theme.surfaceBorder}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-full opacity-90"
        style={{ background: HR_RING, boxShadow: `0 0 12px ${HR_RING}55` }}
      />
      <div className="flex items-center gap-4 mt-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: 'rgba(255, 55, 95, 0.12)', color: HR_RING }}
        >
          <Heart
            size={22}
            strokeWidth={2.25}
            style={isSimulationRunning ? { fill: HR_RING, opacity: 0.35 } : undefined}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: theme.textSecondary }}>
            模拟心率
          </div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-2xl font-bold tabular-nums leading-none" style={{ color: theme.text }}>
              {bpm}
              <span className="text-[13px] font-semibold ml-1" style={{ color: theme.textSecondary }}>
                bpm
              </span>
            </span>
            <span
              className="text-[12px] font-bold px-2 py-0.5 rounded-[8px]"
              style={{
                background:
                  sessionStarted && zoneLabel !== '准备中' ? theme.accentMuted : 'rgba(255,255,255,0.06)',
                color: sessionStarted && zoneLabel !== '准备中' ? theme.accentBright : theme.textTertiary,
              }}
            >
              {zoneLabel}
            </span>
          </div>
          <p className="text-[9px] mt-1.5 leading-tight" style={{ color: theme.textTertiary }}>
            {!sessionStarted && '点击开始训练后，心率将随时长逐步上升'}
            {sessionStarted && isSimulationRunning && '训练中模拟数据，非医疗设备'}
            {sessionStarted && !isSimulationRunning && '已暂停或休息中，示数保持；继续训练后恢复变化'}
          </p>
        </div>
      </div>
    </div>
  );
}
