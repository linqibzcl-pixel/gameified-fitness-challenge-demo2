import type { SavedSession, TrainingHistoryEntry, WorkoutPersistedState } from './types';
import type { ExerciseId } from './exercises';
import { DEFAULT_EXERCISE_ID, isExerciseId } from './exercises';

const STORAGE_KEY = 'squat-workout-v1';
const MAX_TRAINING_HISTORY = 800;

function parseTrainingHistory(raw: unknown): TrainingHistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: TrainingHistoryEntry[] = [];
  for (const x of raw) {
    if (!x || typeof x !== 'object') continue;
    const o = x as Record<string, unknown>;
    if (typeof o.id !== 'string' || typeof o.timestamp !== 'string') continue;
    if (typeof o.exerciseId !== 'string') continue;
    if (o.mode !== 'reps' && o.mode !== 'time') continue;
    if (typeof o.completedValue !== 'number' || typeof o.targetValue !== 'number') continue;
    if (typeof o.completed !== 'boolean') continue;
    if (typeof o.estimatedKcal !== 'number' || typeof o.weightKg !== 'number') continue;
    out.push({
      id: o.id,
      timestamp: o.timestamp,
      exerciseId: o.exerciseId,
      mode: o.mode,
      completedValue: o.completedValue,
      targetValue: o.targetValue,
      completed: o.completed,
      estimatedKcal: o.estimatedKcal,
      weightKg: o.weightKg,
    });
  }
  return out;
}

const defaultState = (): WorkoutPersistedState => ({
  sessions: [],
  lifetimeDurationSec: 0,
  weightKg: 68,
  lastExerciseId: DEFAULT_EXERCISE_ID,
  trainingHistory: [],
});

export function loadWorkoutState(): WorkoutPersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw) as WorkoutPersistedState;
    if (!p || typeof p !== 'object') return defaultState();
    return {
      sessions: Array.isArray(p.sessions) ? p.sessions : [],
      lifetimeDurationSec: typeof p.lifetimeDurationSec === 'number' ? p.lifetimeDurationSec : 0,
      weightKg: typeof p.weightKg === 'number' ? p.weightKg : 68,
      lastExerciseId:
        typeof p.lastExerciseId === 'string' && isExerciseId(p.lastExerciseId)
          ? p.lastExerciseId
          : DEFAULT_EXERCISE_ID,
      trainingHistory: parseTrainingHistory(p.trainingHistory),
    };
  } catch {
    return defaultState();
  }
}

export function saveWorkoutState(state: WorkoutPersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

export function appendSession(
  prev: WorkoutPersistedState,
  session: SavedSession,
  sessionDurationSec: number
): WorkoutPersistedState {
  const next: WorkoutPersistedState = {
    ...prev,
    sessions: [...prev.sessions, session],
    lifetimeDurationSec: prev.lifetimeDurationSec + Math.max(0, sessionDurationSec),
    weightKg: session.weightKg,
  };
  saveWorkoutState(next);
  return next;
}

export function updateWeight(prev: WorkoutPersistedState, weightKg: number): WorkoutPersistedState {
  const next = { ...prev, weightKg };
  saveWorkoutState(next);
  return next;
}

export function updateLastExercise(prev: WorkoutPersistedState, exerciseId: ExerciseId): WorkoutPersistedState {
  const next = { ...prev, lastExerciseId: exerciseId };
  saveWorkoutState(next);
  return next;
}

export function appendTrainingHistoryEntry(
  prev: WorkoutPersistedState,
  entry: TrainingHistoryEntry
): WorkoutPersistedState {
  const prevList = prev.trainingHistory ?? [];
  const merged = [...prevList, entry];
  const trainingHistory =
    merged.length > MAX_TRAINING_HISTORY ? merged.slice(merged.length - MAX_TRAINING_HISTORY) : merged;
  const next = { ...prev, trainingHistory };
  saveWorkoutState(next);
  return next;
}
