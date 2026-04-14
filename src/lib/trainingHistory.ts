import type { ExerciseDefinition } from './exercises';
import { estimateVolumeKcal } from './exercises';
import type { TrainingHistoryEntry } from './types';
import { KCAL_PER_COMPLETED_SET } from '../theme';

function newHistoryId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** 单组完成时生成一条结构化历史（含本组体积千卡 + 每组固定加成） */
export function createTrainingHistoryEntry(
  exercise: ExerciseDefinition,
  weightKg: number,
  targetValue: number,
  completedValue: number
): TrainingHistoryEntry {
  const volKcal = estimateVolumeKcal(completedValue, weightKg, exercise);
  const estimatedKcal = Math.round((volKcal + KCAL_PER_COMPLETED_SET) * 10) / 10;
  return {
    id: newHistoryId(),
    timestamp: new Date().toISOString(),
    exerciseId: exercise.id,
    mode: exercise.mode,
    completedValue,
    targetValue,
    completed: completedValue >= targetValue,
    estimatedKcal,
    weightKg,
  };
}
