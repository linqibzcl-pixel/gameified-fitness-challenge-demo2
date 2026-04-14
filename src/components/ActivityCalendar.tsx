import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DayRecord, SavedSession } from '../lib/types';
import { EXERCISES } from '../lib/exercises';
import { dayRecordsListForExercise } from '../lib/mergeDayRecords';
import { theme } from '../theme';
import CalendarDayDetail, { type CalendarDetailFilter } from './workout/CalendarDayDetail';

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

function dateKeyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function monthMatrix(year: number, month0: number): (Date | null)[][] {
  const first = new Date(year, month0, 1);
  const last = new Date(year, month0 + 1, 0);
  let startPad = first.getDay() - 1;
  if (startPad < 0) startPad = 6;
  const weeks: (Date | null)[][] = [];
  let row: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) row.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    row.push(new Date(year, month0, d));
    if (row.length === 7) {
      weeks.push(row);
      row = [];
    }
  }
  if (row.length) {
    while (row.length < 7) row.push(null);
    weeks.push(row);
  }
  return weeks;
}

interface ActivityCalendarProps {
  records: DayRecord[];
  /** 已保存会话，用于按动作筛选热力、点击某日详情 */
  savedSessions?: SavedSession[];
}

export default function ActivityCalendar({ records, savedSessions }: ActivityCalendarProps) {
  const [calendarFilter, setCalendarFilter] = useState<CalendarDetailFilter>('all');

  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month0 = cursor.getMonth();

  const displayRecords = useMemo(() => {
    if (calendarFilter === 'all') return records;
    if (!savedSessions?.length) return [] as DayRecord[];
    return dayRecordsListForExercise(savedSessions, calendarFilter);
  }, [calendarFilter, records, savedSessions]);

  const recordMap = useMemo(() => {
    const map = new Map<string, DayRecord>();
    for (const r of displayRecords) {
      map.set(r.date, r);
    }
    return map;
  }, [displayRecords]);

  const maxVolume = useMemo(() => {
    let m = 1;
    for (const r of displayRecords) {
      const d = new Date(`${r.date}T12:00:00`);
      if (d.getFullYear() !== year || d.getMonth() !== month0) continue;
      m = Math.max(m, r.reps);
    }
    return m;
  }, [displayRecords, year, month0]);

  const filteredExercise = calendarFilter === 'all' ? null : EXERCISES.find(e => e.id === calendarFilter);

  const weeks = useMemo(() => monthMatrix(year, month0), [year, month0]);

  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDateKey(null);
  }, [calendarFilter]);

  const goPrev = () => setCursor(new Date(year, month0 - 1, 1));
  const goNext = () => setCursor(new Date(year, month0 + 1, 1));

  const monthLabel = `${year} 年 ${month0 + 1} 月`;

  const intensityStyle = (volume: number) => {
    if (volume <= 0) {
      return {
        background: 'rgba(255,255,255,0.05)',
        boxShadow: 'none',
      };
    }
    const t = Math.min(1, volume / maxVolume);
    const alpha = 0.22 + t * 0.78;
    return {
      background: `rgba(48, 209, 88, ${alpha})`,
      boxShadow: t > 0.3 ? `0 0 14px rgba(48, 209, 88, ${0.12 + t * 0.4})` : 'none',
    };
  };

  const cellVolumeLabel = (volume: number) => {
    if (volume <= 0) return null;
    if (filteredExercise?.mode === 'time') return `${volume}s`;
    return String(volume);
  };

  const tooltipMainLine = (rec: DayRecord) => {
    if (rec.reps <= 0) return null;
    if (calendarFilter === 'all') {
      return `训练量 ${rec.reps} · ${rec.sets} 组`;
    }
    if (filteredExercise?.mode === 'time') {
      return `累计 ${rec.reps} 秒 · ${rec.sets} 组`;
    }
    return `完成 ${rec.reps} 次 · ${rec.sets} 组`;
  };

  const tooltipKcalLine = (rec: DayRecord) => {
    if (rec.reps <= 0) return null;
    if (calendarFilter === 'all') {
      return `约 ${rec.calories} kcal（含演示合并）`;
    }
    return `约 ${rec.calories} kcal（已保存）`;
  };

  return (
    <div
      className="rounded-[28px] p-5 overflow-hidden w-full"
      style={{
        background: 'rgba(28, 28, 30, 0.88)',
        border: `1px solid ${theme.surfaceBorder}`,
        backdropFilter: 'blur(24px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: theme.textSecondary }}>
            健身记录
          </div>
          <h2 className="text-[20px] font-bold tracking-tight" style={{ color: theme.text }}>
            {monthLabel}
          </h2>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="上个月"
            onClick={goPrev}
            className="p-2 rounded-[12px] active:scale-95 transition-transform"
            style={{ color: theme.accent, background: theme.accentMuted }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="下个月"
            onClick={goNext}
            className="p-2 rounded-[12px] active:scale-95 transition-transform"
            style={{ color: theme.accent, background: theme.accentMuted }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <p className="text-[12px] mb-2 font-medium" style={{ color: theme.textTertiary }}>
        {calendarFilter === 'all'
          ? '全部：演示数据与已保存训练合并 · 点按日期查看已保存详情'
          : `${filteredExercise?.name ?? ''}：仅已保存记录 · 点按日期查看详情`}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <button
          type="button"
          onClick={() => setCalendarFilter('all')}
          className="px-3 py-1.5 rounded-[12px] text-[12px] font-semibold transition-all"
          style={{
            background: calendarFilter === 'all' ? theme.accentMuted : 'rgba(255,255,255,0.05)',
            color: calendarFilter === 'all' ? theme.accentBright : theme.textTertiary,
            border: `1px solid ${calendarFilter === 'all' ? theme.accentBorder : theme.surfaceBorder}`,
          }}
        >
          全部
        </button>
        {EXERCISES.map(ex => {
          const sel = calendarFilter === ex.id;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => setCalendarFilter(ex.id)}
              className="px-3 py-1.5 rounded-[12px] text-[12px] font-semibold transition-all"
              style={{
                background: sel ? theme.accentMuted : 'rgba(255,255,255,0.05)',
                color: sel ? theme.accentBright : theme.textTertiary,
                border: `1px solid ${sel ? theme.accentBorder : theme.surfaceBorder}`,
              }}
            >
              {ex.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map(w => (
          <div
            key={w}
            className="text-center text-[10px] font-semibold uppercase py-1"
            style={{ color: theme.textSecondary }}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((cell, di) => {
              if (!cell) {
                return <div key={`e-${wi}-${di}`} className="aspect-square rounded-[11px]" />;
              }
              const key = dateKeyLocal(cell);
              const rec = recordMap.get(key);
              const volume = rec?.reps ?? 0;
              const isHover = hoverKey === key;

              const isSelected = selectedDateKey === key;
              const volLabel = cellVolumeLabel(volume);

              return (
                <div key={key} className="relative aspect-square">
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDateKey(k => (k === key ? null : key))}
                    onMouseEnter={() => setHoverKey(key)}
                    onMouseLeave={() => setHoverKey(null)}
                    className="w-full h-full rounded-[11px] flex flex-col items-center justify-center transition-transform duration-200 border"
                    style={{
                      ...intensityStyle(volume),
                      borderColor: isSelected
                        ? theme.accentBright
                        : isHover
                          ? theme.accentBorder
                          : 'rgba(255,255,255,0.07)',
                      boxShadow: isSelected ? `0 0 0 2px ${theme.accent}, inset 0 0 0 1px rgba(0,0,0,0.2)` : undefined,
                      transform: isHover ? 'scale(1.07)' : 'scale(1)',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      className="text-[11px] font-bold leading-none"
                      style={{ color: volume > 0 ? '#0a0a0a' : theme.textSecondary }}
                    >
                      {cell.getDate()}
                    </span>
                    {volLabel != null && (
                      <span
                        className="text-[8px] font-semibold mt-0.5 leading-none opacity-90"
                        style={{ color: '#0a0a0a' }}
                      >
                        {volLabel}
                      </span>
                    )}
                  </button>
                  {isHover && (
                    <div
                      className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 rounded-[12px] text-left whitespace-nowrap pointer-events-none"
                      style={{
                        background: '#3a3a3c',
                        border: `1px solid ${theme.surfaceBorder}`,
                        boxShadow: '0 10px 28px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div className="text-[12px] font-bold" style={{ color: theme.text }}>
                        {key}
                      </div>
                      {rec && rec.reps > 0 ? (
                        <>
                          <div className="text-[11px] mt-1 font-semibold" style={{ color: theme.accentBright }}>
                            {tooltipMainLine(rec)}
                          </div>
                          <div className="text-[10px]" style={{ color: theme.textSecondary }}>
                            {tooltipKcalLine(rec)}
                          </div>
                        </>
                      ) : (
                        <div className="text-[11px] mt-1" style={{ color: theme.textSecondary }}>
                          无记录
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {savedSessions && selectedDateKey && (
        <CalendarDayDetail
          dateKey={selectedDateKey}
          sessions={savedSessions}
          exerciseFilter={calendarFilter}
          onClose={() => setSelectedDateKey(null)}
        />
      )}

      <div
        className="flex items-center justify-between mt-5 pt-4"
        style={{ borderTop: `1px solid ${theme.surfaceBorder}` }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: theme.textTertiary }}>
            强度
          </span>
          {calendarFilter !== 'all' && filteredExercise && (
            <span className="text-[9px] font-medium leading-tight" style={{ color: theme.textTertiary }}>
              {filteredExercise.mode === 'time' ? '按秒数' : '按次数'}相对当月峰值
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium" style={{ color: theme.textSecondary }}>
            低
          </span>
          {[0.15, 0.35, 0.55, 0.85, 1].map((t, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-md"
              style={{
                background: `rgba(48, 209, 88, ${0.2 + t * 0.75})`,
                boxShadow: i > 2 ? '0 0 8px rgba(48,209,88,0.22)' : undefined,
              }}
            />
          ))}
          <span className="text-[10px] font-medium" style={{ color: theme.textSecondary }}>
            高
          </span>
        </div>
      </div>
    </div>
  );
}
