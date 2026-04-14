import type { LucideIcon } from 'lucide-react';
import { Activity, Dumbbell, MoveVertical, Timer } from 'lucide-react';
import { CALORIES_PER_SQUAT_AT_REF, KCAL_PER_COMPLETED_SET, REF_WEIGHT_KG } from '../theme';

export type ExerciseId = 'squat' | 'pushup' | 'jumping_jack' | 'plank';
export type ExerciseMode = 'reps' | 'time';

export interface ExerciseDefinition {
  id: ExerciseId;
  /** 顶部标题、完成文案 */
  name: string;
  mode: ExerciseMode;
  /** 次数或秒，取决于 mode */
  targetOptions: readonly number[];
  /** 在 70kg 参考体重下，每个「次数」的千卡系数（仅 reps 模式） */
  kcalPerRepAtRef: number;
  /** 在 70kg 参考体重下，每秒的千卡系数（仅 time 模式）；reps 动作填 0 */
  kcalPerSecAtRef: number;
  /** 触发撒花的累计阈值（次数或秒） */
  confettiThreshold: number;
  icon: LucideIcon;
}

/**
 * 集中定义所有动作。新增动作：在此数组追加一项，并保证 id 唯一。
 */
export const EXERCISES: readonly ExerciseDefinition[] = [
  {
    id: 'squat',
    name: '深蹲',
    mode: 'reps',
    targetOptions: [5, 10, 15, 20, 30],
    kcalPerRepAtRef: CALORIES_PER_SQUAT_AT_REF,
    kcalPerSecAtRef: 0,
    confettiThreshold: 20,
    icon: Activity,
  },
  {
    id: 'pushup',
    name: '俯卧撑',
    mode: 'reps',
    targetOptions: [5, 10, 15, 20, 30],
    kcalPerRepAtRef: 0.22,
    kcalPerSecAtRef: 0,
    confettiThreshold: 20,
    icon: Dumbbell,
  },
  {
    id: 'jumping_jack',
    name: '开合跳',
    mode: 'reps',
    targetOptions: [10, 20, 30, 40, 50],
    kcalPerRepAtRef: 0.26,
    kcalPerSecAtRef: 0,
    confettiThreshold: 30,
    icon: MoveVertical,
  },
  {
    id: 'plank',
    name: '平板支撑',
    mode: 'time',
    targetOptions: [30, 45, 60, 90, 120],
    kcalPerRepAtRef: 0,
    kcalPerSecAtRef: 0.055,
    confettiThreshold: 60,
    icon: Timer,
  },
] as const;

const byId = new Map(EXERCISES.map(e => [e.id, e]));

export function getExercise(id: string): ExerciseDefinition {
  const e = byId.get(id as ExerciseId);
  return e ?? EXERCISES[0];
}

export function isExerciseId(id: string): id is ExerciseId {
  return byId.has(id as ExerciseId);
}

/** 单段「本组」体积对应的千卡（不含每组加成） */
export function estimateVolumeKcal(volume: number, weightKg: number, ex: ExerciseDefinition): number {
  if (volume <= 0 || weightKg <= 0) return 0;
  if (ex.mode === 'reps') {
    return Math.round(volume * ex.kcalPerRepAtRef * (weightKg / REF_WEIGHT_KG) * 10) / 10;
  }
  return Math.round(volume * ex.kcalPerSecAtRef * (weightKg / REF_WEIGHT_KG) * 10) / 10;
}

/** 本次训练合计：体积千卡 + 已完成组的固定加成（当前组未完成不加成） */
export function estimateSessionExerciseKcal(
  totalVolume: number,
  completedSets: number,
  weightKg: number,
  ex: ExerciseDefinition
): number {
  const fromVolume = estimateVolumeKcal(totalVolume, weightKg, ex);
  const fromSets = Math.max(0, completedSets) * KCAL_PER_COMPLETED_SET;
  return Math.round((fromVolume + fromSets) * 10) / 10;
}

export const DEFAULT_EXERCISE_ID: ExerciseId = 'squat';
