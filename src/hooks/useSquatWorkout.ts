import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { SetRecord, SavedSession, DayRecord, ChallengeResult } from '../lib/types';
import {
  loadWorkoutState,
  appendSession,
  appendTrainingHistoryEntry,
  updateWeight,
  updateLastExercise,
} from '../lib/workoutStorage';
import { createTrainingHistoryEntry } from '../lib/trainingHistory';
import { mergeDayRecords, dayRecordsFromSessions } from '../lib/mergeDayRecords';
import mockData from '../data/mockData.json';
import {
  EXERCISES,
  type ExerciseId,
  getExercise,
  estimateSessionExerciseKcal,
  estimateVolumeKcal,
} from '../lib/exercises';
import { sessionSetBonusKcal } from '../theme';
import { playSetCompleteChime, playWorkoutSavedChime, primeWorkoutAudio } from '../lib/playWorkoutSound';
import {
  buildMockChallengeResult,
  buildSessionChallengeView,
  computeSessionChallengeMetrics,
} from '../lib/challengeResult';

const REST_SECONDS = 30;

export { REST_SECONDS, EXERCISES };

function initialTargetsByExercise(): Record<ExerciseId, number> {
  const m = {} as Record<ExerciseId, number>;
  for (const e of EXERCISES) {
    m[e.id] = e.targetOptions[1] ?? e.targetOptions[0];
  }
  return m;
}

export function useSquatWorkout() {
  const [persisted, setPersisted] = useState(loadWorkoutState);

  const [exerciseId, setExerciseId] = useState<ExerciseId>(() => persisted.lastExerciseId ?? EXERCISES[0].id);
  const [targetsByExercise, setTargetsByExercise] = useState(initialTargetsByExercise);

  const [count, setCount] = useState(0);
  const [sets, setSets] = useState<SetRecord[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isSquatting, setIsSquatting] = useState(false);
  const [resting, setResting] = useState(false);
  const [restTimer, setRestTimer] = useState(REST_SECONDS);
  const [flash, setFlash] = useState(false);
  const [setComplete, setSetComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [weightKg, setWeightKg] = useState(persisted.weightKg);
  const [simulatedHrBpm, setSimulatedHrBpm] = useState(110);
  /** 本次页面会话是否已按过「开始」（用于区分未开始 / 暂停） */
  const [hrSessionStarted, setHrSessionStarted] = useState(false);
  /** 保存成功且 showSuccessModal 时展示祝贺弹窗，仅存本次 challenge 快照 */
  const [successModalChallenge, setSuccessModalChallenge] = useState<ChallengeResult | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedSecondsRef = useRef(0);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const squatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeSetCompleteLock = useRef(false);

  const exercise = useMemo(() => getExercise(exerciseId), [exerciseId]);
  const targetReps = targetsByExercise[exerciseId];

  useEffect(() => {
    elapsedSecondsRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  /** 模拟心率：仅在训练中且非休息时更新；随已训练秒数缓慢爬升并带平滑随机波动 */
  useEffect(() => {
    if (!isActive || resting) return;
    const id = setInterval(() => {
      const t = elapsedSecondsRef.current;
      const progress = Math.min(1, t / 280);
      const center = 117 + progress * 38;
      const jitter = (Math.random() - 0.5) * 4.5;
      setSimulatedHrBpm(prev => {
        const target = center + jitter;
        const next = 0.72 * prev + 0.28 * target;
        return Math.round(Math.min(160, Math.max(110, next)));
      });
    }, 1100);
    return () => clearInterval(id);
  }, [isActive, resting]);

  useEffect(() => {
    if (isActive) setHrSessionStarted(true);
  }, [isActive]);

  const simulatedHrZone = useMemo(() => {
    if (!hrSessionStarted && !isActive) return '准备中';
    if (simulatedHrBpm <= 129) return '燃脂';
    if (simulatedHrBpm <= 149) return '有氧';
    return '高强度';
  }, [hrSessionStarted, isActive, simulatedHrBpm]);

  useEffect(() => {
    if (isActive && !resting) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, resting]);

  useEffect(() => {
    if (resting) {
      setRestTimer(REST_SECONDS);
      restRef.current = setInterval(() => {
        setRestTimer(t => {
          if (t <= 1) {
            clearInterval(restRef.current!);
            setResting(false);
            return REST_SECONDS;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (restRef.current) clearInterval(restRef.current);
    };
  }, [resting]);

  /** 平板支撑：进行中每秒自动累加 */
  useEffect(() => {
    if (exercise.mode !== 'time' || !isActive || resting) return;
    const id = setInterval(() => {
      setCount(c => {
        if (c >= targetReps) return c;
        const next = c + 1;
        if (next > exercise.confettiThreshold) {
          setTriggerConfetti(true);
          setTimeout(() => setTriggerConfetti(false), 100);
        }
        return next;
      });
      setFlash(true);
      setIsSquatting(true);
      if (squatTimeoutRef.current) clearTimeout(squatTimeoutRef.current);
      squatTimeoutRef.current = setTimeout(() => setIsSquatting(false), 220);
      setTimeout(() => setFlash(false), 200);
    }, 1000);
    return () => clearInterval(id);
  }, [exercise.mode, exercise.confettiThreshold, isActive, resting, targetReps]);

  useEffect(() => {
    if (exercise.mode !== 'time' || resting || !isActive) {
      timeSetCompleteLock.current = false;
      return;
    }
    if (count <= 0 || count < targetReps) return;
    if (count !== targetReps || timeSetCompleteLock.current) return;
    timeSetCompleteLock.current = true;
    playSetCompleteChime();
    setSetComplete(true);
    setSets(prev => [...prev, { reps: count, timestamp: new Date() }]);
    setPersisted(prev =>
      appendTrainingHistoryEntry(prev, createTrainingHistoryEntry(exercise, weightKg, targetReps, count))
    );
    setTimeout(() => {
      setSetComplete(false);
      setCount(0);
      setResting(true);
      timeSetCompleteLock.current = false;
    }, 1200);
  }, [count, targetReps, exercise, exercise.mode, resting, isActive, weightKg]);

  const handleCount = useCallback(() => {
    if (exercise.mode === 'time') return;
    if (!isActive || resting) return;

    const newCount = count + 1;
    setCount(newCount);
    setFlash(true);
    setIsSquatting(true);

    if (squatTimeoutRef.current) clearTimeout(squatTimeoutRef.current);
    squatTimeoutRef.current = setTimeout(() => setIsSquatting(false), 350);

    setTimeout(() => setFlash(false), 300);

    if (newCount > exercise.confettiThreshold) {
      setTriggerConfetti(true);
      setTimeout(() => setTriggerConfetti(false), 100);
    }

    if (newCount >= targetReps) {
      playSetCompleteChime();
      setSetComplete(true);
      setSets(prev => [...prev, { reps: newCount, timestamp: new Date() }]);
      setPersisted(prev =>
        appendTrainingHistoryEntry(prev, createTrainingHistoryEntry(exercise, weightKg, targetReps, newCount))
      );
      setTimeout(() => {
        setSetComplete(false);
        setCount(0);
        setResting(true);
      }, 1200);
    }
  }, [exercise, exercise.mode, exercise.confettiThreshold, isActive, resting, count, targetReps, weightKg]);

  const handleSkipRest = useCallback(() => {
    if (restRef.current) clearInterval(restRef.current);
    setResting(false);
  }, []);

  const handleToggleActive = useCallback(() => {
    primeWorkoutAudio();
    setIsActive(a => !a);
  }, []);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (restRef.current) clearInterval(restRef.current);
  }, []);

  const handleReset = useCallback(() => {
    setCount(0);
    setSets([]);
    setIsActive(false);
    setResting(false);
    setElapsedSeconds(0);
    setFlash(false);
    setSetComplete(false);
    setIsSquatting(false);
    setSimulatedHrBpm(110);
    setHrSessionStarted(false);
    clearTimers();
  }, [clearTimers]);

  const setExerciseIdAndReset = useCallback((id: ExerciseId) => {
    clearTimers();
    if (squatTimeoutRef.current) clearTimeout(squatTimeoutRef.current);
    setExerciseId(id);
    setCount(0);
    setSets([]);
    setIsActive(false);
    setResting(false);
    setElapsedSeconds(0);
    setFlash(false);
    setSetComplete(false);
    setIsSquatting(false);
    timeSetCompleteLock.current = false;
    setSimulatedHrBpm(110);
    setHrSessionStarted(false);
    setPersisted(prev => updateLastExercise(prev, id));
  }, [clearTimers]);

  const totalReps = sets.reduce((a, b) => a + b.reps, 0) + count;
  const completedSets = sets.length;
  const sessionKcal = estimateSessionExerciseKcal(totalReps, completedSets, weightKg, exercise);
  const setRepsOnlyKcal = estimateVolumeKcal(count, weightKg, exercise);
  const setBonusSoFar = sessionSetBonusKcal(completedSets);
  const progress = targetReps > 0 ? Math.min(1, count / targetReps) : 0;

  const sessionChallenge = useMemo(
    () =>
      buildSessionChallengeView(
        computeSessionChallengeMetrics({
          mode: exercise.mode,
          targetReps,
          setReps: sets.map(s => s.reps),
          currentPartial: count,
        })
      ),
    [exercise.mode, targetReps, sets, count]
  );

  const formatTime = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      return `${h}:${mm.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }, []);

  const onWeightKgChange = useCallback((kg: number) => {
    if (Number.isNaN(kg)) return;
    const w = Math.min(200, Math.max(30, kg));
    setWeightKg(w);
    setPersisted(prev => updateWeight(prev, w));
  }, []);

  const setTargetRepsAndClearCount = useCallback(
    (n: number) => {
      setTargetsByExercise(prev => ({ ...prev, [exerciseId]: n }));
      setCount(0);
    },
    [exerciseId]
  );

  const dismissSuccessModal = useCallback(() => setSuccessModalChallenge(null), []);

  const handleSuccessModalAgain = useCallback(() => {
    handleReset();
    setSuccessModalChallenge(null);
  }, [handleReset]);

  const saveWorkout = useCallback(() => {
    primeWorkoutAudio();
    const finalSets: SetRecord[] = [...sets];
    if (count > 0) {
      finalSets.push({ reps: count, timestamp: new Date() });
    }
    const repsTotal = finalSets.reduce((a, s) => a + s.reps, 0);
    if (repsTotal === 0) return;

    const endedAt = new Date();
    const durationSec = elapsedSeconds;
    const cals = estimateSessionExerciseKcal(repsTotal, finalSets.length, weightKg, exercise);

    const challengeResult = buildMockChallengeResult({
      mode: exercise.mode,
      targetReps,
      setReps: finalSets.map(s => s.reps),
      currentPartial: 0,
    });
    console.log('[challenge]', challengeResult);

    const session: SavedSession = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      endedAt: endedAt.toISOString(),
      durationSec,
      totalReps: repsTotal,
      sets: finalSets.map(s => ({ reps: s.reps, at: s.timestamp.toISOString() })),
      weightKg,
      caloriesEstimate: cals,
      exerciseId: exercise.id,
      challengeResult,
    };

    setPersisted(prev => appendSession(prev, session, durationSec));
    playWorkoutSavedChime();
    handleReset();
    if (challengeResult.showSuccessModal) {
      setSuccessModalChallenge(challengeResult);
    }
  }, [sets, count, elapsedSeconds, weightKg, exercise, handleReset, targetReps]);

  const mergedDayRecords: DayRecord[] = useMemo(() => {
    const mock = mockData.records as DayRecord[];
    const localMap = dayRecordsFromSessions(persisted.sessions);
    return mergeDayRecords(mock, localMap);
  }, [persisted.sessions]);

  const displayLifetimeSec = persisted.lifetimeDurationSec + elapsedSeconds;

  return {
    exercise,
    exerciseId,
    setExerciseId: setExerciseIdAndReset,
    count,
    sets,
    targetReps,
    setTargetRepsAndClearCount,
    isActive,
    isSquatting,
    resting,
    restTimer,
    flash,
    setComplete,
    elapsedSeconds,
    triggerConfetti,
    weightKg,
    totalReps,
    completedSets,
    sessionKcal,
    setRepsOnlyKcal,
    setBonusSoFar,
    progress,
    formatTime,
    displayLifetimeSec,
    mergedDayRecords,
    savedSessions: persisted.sessions,
    trainingHistory: persisted.trainingHistory ?? [],
    simulatedHrBpm,
    simulatedHrZone,
    hrSessionStarted,
    handleCount,
    handleSkipRest,
    handleToggleActive,
    handleReset,
    onWeightKgChange,
    saveWorkout,
    sessionChallenge,
    successModalChallenge,
    dismissSuccessModal,
    handleSuccessModalAgain,
  };
}
