import { useMemo } from 'react';
import { X } from 'lucide-react';
import type { SavedSession } from '../../lib/types';
import { EXERCISES, type ExerciseId } from '../../lib/exercises';
import { sessionEndedLocalDateKey } from '../../lib/mergeDayRecords';
import { theme } from '../../theme';

export type CalendarDetailFilter = 'all' | ExerciseId;

interface Props {
  dateKey: string;
  sessions: SavedSession[];
  onClose: () => void;
  /** 与日历筛选一致：仅「全部」时展示当日所有动作 */
  exerciseFilter?: CalendarDetailFilter;
}

interface GroupRow {
  exerciseId: string;
  name: string;
  mode: 'reps' | 'time';
  volume: number;
  sets: number;
  kcal: number;
}

function buildGroups(dateKey: string, sessions: SavedSession[]): GroupRow[] {
  const map = new Map<string, { volume: number; sets: number; kcal: number }>();
  for (const s of sessions) {
    if (sessionEndedLocalDateKey(s.endedAt) !== dateKey) continue;
    const id = s.exerciseId ?? 'squat';
    const prev = map.get(id);
    if (!prev) {
      map.set(id, { volume: s.totalReps, sets: s.sets.length, kcal: s.caloriesEstimate });
    } else {
      map.set(id, {
        volume: prev.volume + s.totalReps,
        sets: prev.sets + s.sets.length,
        kcal: Math.round((prev.kcal + s.caloriesEstimate) * 10) / 10,
      });
    }
  }

  const order = new Map(EXERCISES.map((e, i) => [e.id, i]));
  const rows: GroupRow[] = [...map.entries()].map(([exerciseId, a]) => {
    const ex = EXERCISES.find(e => e.id === exerciseId);
    return {
      exerciseId,
      name: ex?.name ?? exerciseId,
      mode: ex?.mode ?? 'reps',
      volume: a.volume,
      sets: a.sets,
      kcal: a.kcal,
    };
  });
  rows.sort(
    (a, b) => (order.get(a.exerciseId as ExerciseId) ?? 99) - (order.get(b.exerciseId as ExerciseId) ?? 99)
  );
  return rows;
}

export default function CalendarDayDetail({
  dateKey,
  sessions,
  onClose,
  exerciseFilter = 'all',
}: Props) {
  const filteredName = EXERCISES.find(e => e.id === exerciseFilter)?.name;

  const rows = useMemo(() => {
    const all = buildGroups(dateKey, sessions);
    if (exerciseFilter === 'all') return all;
    return all.filter(r => r.exerciseId === exerciseFilter);
  }, [dateKey, sessions, exerciseFilter]);

  const dayTotalKcal = useMemo(
    () => Math.round(rows.reduce((s, r) => s + r.kcal, 0) * 10) / 10,
    [rows]
  );

  return (
    <div
      className="mt-4 rounded-[20px] p-4 w-full"
      style={{
        background: 'rgba(0, 0, 0, 0.35)',
        border: `1px solid ${theme.surfaceBorder}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: theme.textTertiary }}>
            当日训练详情
            {exerciseFilter !== 'all' && filteredName ? ` · ${filteredName}` : ''}
          </div>
          <div className="text-[16px] font-bold mt-0.5" style={{ color: theme.text }}>
            {dateKey}
          </div>
          <p className="text-[10px] mt-1 leading-snug" style={{ color: theme.textTertiary }}>
            仅统计已保存到本地的记录
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-[10px] shrink-0"
          style={{ color: theme.textSecondary, border: `1px solid ${theme.surfaceBorder}` }}
          aria-label="关闭详情"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-[13px] py-3 text-center font-medium" style={{ color: theme.textSecondary }}>
          {exerciseFilter === 'all'
            ? '该日暂无已保存训练（格子上的数字可能来自演示数据或其它日合并展示）'
            : `该日暂无「${filteredName ?? exerciseFilter}」的已保存记录`}
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {rows.map(r => (
              <div
                key={r.exerciseId}
                className="rounded-[14px] px-3 py-3"
                style={{ background: 'rgba(28, 28, 30, 0.9)', border: `1px solid ${theme.surfaceBorder}` }}
              >
                <div className="text-[15px] font-bold mb-2" style={{ color: theme.accentBright }}>
                  {r.name}
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
                  <span style={{ color: theme.textSecondary }}>{r.mode === 'reps' ? '完成次数' : '累计时长'}</span>
                  <span className="font-semibold tabular-nums text-right" style={{ color: theme.text }}>
                    {r.volume} {r.mode === 'reps' ? '次' : '秒'}
                  </span>
                  <span style={{ color: theme.textSecondary }}>组数</span>
                  <span className="font-semibold tabular-nums text-right" style={{ color: theme.text }}>
                    {r.sets} 组
                  </span>
                  <span style={{ color: theme.textSecondary }}>估算卡路里</span>
                  <span className="font-semibold tabular-nums text-right" style={{ color: theme.accent }}>
                    {r.kcal} kcal
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="flex justify-between items-center mt-3 pt-3 text-[13px] font-bold"
            style={{ borderTop: `1px solid ${theme.surfaceBorder}`, color: theme.text }}
          >
            <span style={{ color: theme.textSecondary }}>
              {exerciseFilter === 'all' ? '当日合计' : '该项合计'}
            </span>
            <span className="tabular-nums" style={{ color: theme.accentBright }}>
              {dayTotalKcal} kcal
            </span>
          </div>
        </>
      )}
    </div>
  );
}
