import type { ChallengeResult } from './types';
import type { ExerciseMode } from './exercises';

export interface SessionChallengeInput {
  /** 次数型为次数、计时型为秒；与现有 count / set.reps 语义一致 */
  mode: ExerciseMode;
  targetReps: number;
  /** 已完成每组的量（次数或秒） */
  setReps: number[];
  /** 当前这一组已进行量（未完成组），无则为 0 */
  currentPartial: number;
}

export interface SessionChallengeMetrics {
  completionRate: number;
  score: number;
}

/** 与完成度挂钩的星级（不修改 completionRate 本身，仅映射展示） */
export function completionRateToStarLevel(completionRate: number): 0 | 1 | 2 | 3 {
  if (completionRate >= 100) return 3;
  if (completionRate >= 80) return 2;
  if (completionRate >= 50) return 1;
  return 0;
}

/** 勋章文案：与星级一致，实时区与保存共用（仅按 starLevel，score/completionRate 已由星级间接体现） */
export function badgeTextForStarLevel(starLevel: 0 | 1 | 2 | 3): string {
  switch (starLevel) {
    case 3:
      return '今日挑战达人';
    case 2:
      return '稳定输出选手';
    case 1:
      return '节奏不错，再冲一把';
    default:
      return '继续加油';
  }
}

/**
 * 完成度 = 实际完成总量 / 期望总量。
 * 期望总量 = 每组目标 × slot 数；slot = 已完成组数 +（当前组有进度则 +1）。
 * reps / time 共用同一套比例（单位分别为次或秒）。
 */
export function computeSessionChallengeMetrics(input: SessionChallengeInput): SessionChallengeMetrics {
  const target = Math.max(1, input.targetReps);
  const actual = input.setReps.reduce((a, b) => a + b, 0) + input.currentPartial;
  const slots = Math.max(1, input.setReps.length + (input.currentPartial > 0 ? 1 : 0));
  const sessionTarget = target * slots;
  const rawRatio = sessionTarget > 0 ? actual / sessionTarget : 0;

  const completionRate = Math.min(100, Math.round(Math.max(0, rawRatio) * 100));

  let score: number;
  if (rawRatio >= 1) {
    score = 100 + Math.min(50, Math.round((rawRatio - 1) * 100));
  } else {
    score = Math.round(100 * Math.max(0, rawRatio));
  }
  score = Math.min(200, Math.max(0, score));

  return { completionRate, score };
}

export type SessionChallengeView = SessionChallengeMetrics & {
  starLevel: 0 | 1 | 2 | 3;
  badgeText: string;
};

export function buildSessionChallengeView(metrics: SessionChallengeMetrics): SessionChallengeView {
  const starLevel = completionRateToStarLevel(metrics.completionRate);
  return {
    ...metrics,
    starLevel,
    badgeText: badgeTextForStarLevel(starLevel),
  };
}

export interface BuildMockChallengeInput {
  mode: ExerciseMode;
  targetReps: number;
  setReps: number[];
  currentPartial: number;
}

/** 持久化用的完整挑战结果；得分与完成度与 computeSessionChallengeMetrics 一致 */
export function buildMockChallengeResult(input: BuildMockChallengeInput): ChallengeResult {
  if (input.setReps.length === 0 && input.currentPartial === 0) {
    return {
      score: 0,
      completionRate: 0,
      streak: 0,
      starLevel: 0,
      badgeText: '暂无数据',
      showSuccessModal: false,
    };
  }

  const { completionRate, score } = computeSessionChallengeMetrics(input);
  const streak = input.setReps.length + (input.currentPartial > 0 ? 1 : 0);

  const starLevel = completionRateToStarLevel(completionRate);
  const badgeText = badgeTextForStarLevel(starLevel);

  const showSuccessModal = completionRate >= 100;

  return {
    score,
    completionRate,
    streak,
    starLevel,
    badgeText,
    showSuccessModal,
  };
}
