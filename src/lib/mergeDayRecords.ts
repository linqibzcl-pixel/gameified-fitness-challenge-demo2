import type { DayRecord, SavedSession } from './types';
import type { ExerciseId } from './exercises';

/** 会话结束时间对应的本地日历日（与日历格子 dateKey 一致） */
export function sessionEndedLocalDateKey(iso: string): string {
  const end = new Date(iso);
  const y = end.getFullYear();
  const m = String(end.getMonth() + 1).padStart(2, '0');
  const day = String(end.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dayRecordsFromSessions(sessions: SavedSession[]): Map<string, DayRecord> {
  const map = new Map<string, DayRecord>();
  for (const s of sessions) {
    const d = sessionEndedLocalDateKey(s.endedAt);
    const prev = map.get(d);
    const reps = (prev?.reps ?? 0) + s.totalReps;
    const sets = (prev?.sets ?? 0) + s.sets.length;
    const calories = Math.round(((prev?.calories ?? 0) + s.caloriesEstimate) * 10) / 10;
    map.set(d, { date: d, reps, sets, calories });
  }
  return map;
}

/**
 * 仅统计某一动作的按日汇总（体积在 DayRecord.reps 中：次数或秒，与动作的 mode 一致）。
 * 用于日历按动作筛选时的热力数据，不含演示 mock。
 */
export function dayRecordsListForExercise(sessions: SavedSession[], exerciseId: ExerciseId): DayRecord[] {
  const map = new Map<string, DayRecord>();
  for (const s of sessions) {
    const sid = s.exerciseId ?? 'squat';
    if (sid !== exerciseId) continue;
    const d = sessionEndedLocalDateKey(s.endedAt);
    const prev = map.get(d);
    if (!prev) {
      map.set(d, {
        date: d,
        reps: s.totalReps,
        sets: s.sets.length,
        calories: s.caloriesEstimate,
      });
    } else {
      map.set(d, {
        date: d,
        reps: prev.reps + s.totalReps,
        sets: prev.sets + s.sets.length,
        calories: Math.round((prev.calories + s.caloriesEstimate) * 10) / 10,
      });
    }
  }
  return Array.from(map.values());
}

/** Local sessions override / add to mock seed rows for the same date (additive). */
export function mergeDayRecords(mock: DayRecord[], sessionMap: Map<string, DayRecord>): DayRecord[] {
  const byDate = new Map<string, DayRecord>();
  for (const r of mock) {
    byDate.set(r.date, { ...r });
  }
  for (const [d, loc] of sessionMap) {
    const ex = byDate.get(d);
    if (ex) {
      byDate.set(d, {
        date: d,
        reps: ex.reps + loc.reps,
        sets: ex.sets + loc.sets,
        calories: Math.round((ex.calories + loc.calories) * 10) / 10,
      });
    } else {
      byDate.set(d, { ...loc });
    }
  }
  return Array.from(byDate.values());
}
