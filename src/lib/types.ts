import type { ExerciseId } from './exercises';

export interface SetRecord {
  reps: number;
  timestamp: Date;
}

/** 游戏化挑战结果（mock 规则生成，后续可接真实算法） */
export interface ChallengeResult {
  score: number;
  /** 0–100 */
  completionRate: number;
  /** 连击数（当前为 mock：本次完成组数） */
  streak: number;
  /** 0 = 完成度不足一档，界面可不展示星 */
  starLevel: 0 | 1 | 2 | 3;
  badgeText: string;
  showSuccessModal: boolean;
}

export interface SavedSession {
  id: string;
  endedAt: string;
  durationSec: number;
  /** 次数合计或秒数合计（由 exerciseId 对应动作的 mode 决定） */
  totalReps: number;
  sets: { reps: number; at: string }[];
  weightKg: number;
  caloriesEstimate: number;
  /** 训练动作；旧数据缺省视为深蹲 */
  exerciseId?: string;
  challengeResult?: ChallengeResult;
}

export interface DayRecord {
  date: string;
  reps: number;
  sets: number;
  calories: number;
}

/** 单组完成时的结构化历史，独立于日历用的 DayRecord 聚合 */
export interface TrainingHistoryEntry {
  id: string;
  timestamp: string;
  exerciseId: string;
  mode: 'reps' | 'time';
  completedValue: number;
  targetValue: number;
  completed: boolean;
  estimatedKcal: number;
  weightKg: number;
}

export interface WorkoutPersistedState {
  sessions: SavedSession[];
  lifetimeDurationSec: number;
  weightKg: number;
  lastExerciseId?: ExerciseId;
  trainingHistory?: TrainingHistoryEntry[];
}
