import Confetti from './Confetti';
import ActivityCalendar from './ActivityCalendar';
import WorkoutLayout from './workout/WorkoutLayout';
import FitnessHeader from './workout/FitnessHeader';
import SessionSummaryRings from './workout/SessionSummaryRings';
import SimulatedHeartRateCard from './workout/SimulatedHeartRateCard';
import WorkoutSessionCard from './workout/WorkoutSessionCard';
import WorkoutControls from './workout/WorkoutControls';
import TargetRepsPicker from './workout/TargetRepsPicker';
import SetHistoryPanel from './workout/SetHistoryPanel';
import TrainingHistoryPanel from './workout/TrainingHistoryPanel';
import ExercisePicker from './workout/ExercisePicker';
import ChallengeSuccessModal from './workout/ChallengeSuccessModal';
import { useSquatWorkout } from '../hooks/useSquatWorkout';
import { theme } from '../theme';

export default function SquatCounter() {
  const w = useSquatWorkout();

  const canSave = w.totalReps > 0;

  return (
    <WorkoutLayout>
      <ChallengeSuccessModal
        open={w.successModalChallenge !== null}
        result={w.successModalChallenge}
        onClose={w.dismissSuccessModal}
        onAgain={w.handleSuccessModalAgain}
      />
      <Confetti trigger={w.triggerConfetti} />

      <div className="w-full max-w-md flex flex-col items-stretch">
        <FitnessHeader
          exerciseName={w.exercise.name}
          weightKg={w.weightKg}
          onWeightKgChange={w.onWeightKgChange}
        />

        <ExercisePicker selectedId={w.exerciseId} onSelect={w.setExerciseId} />

        <SessionSummaryRings
          setsDone={w.completedSets}
          sessionKcal={w.sessionKcal}
          sessionTimeLabel={w.formatTime(w.elapsedSeconds)}
          lifetimeTimeLabel={w.formatTime(w.displayLifetimeSec)}
        />

        <SimulatedHeartRateCard
          bpm={w.simulatedHrBpm}
          zoneLabel={w.simulatedHrZone}
          isSimulationRunning={w.isActive && !w.resting}
          sessionStarted={w.hrSessionStarted}
        />

        <WorkoutSessionCard
          exercise={w.exercise}
          setComplete={w.setComplete}
          targetReps={w.targetReps}
          resting={w.resting}
          restTimer={w.restTimer}
          onSkipRest={w.handleSkipRest}
          isSquatting={w.isSquatting}
          isActive={w.isActive}
          count={w.count}
          flash={w.flash}
          progress={w.progress}
          setsLength={w.sets.length}
          weightKg={w.weightKg}
          setRepsOnlyKcal={w.setRepsOnlyKcal}
          setBonusSoFar={w.setBonusSoFar}
          sessionKcal={w.sessionKcal}
          completedSets={w.completedSets}
        />

        <div
          className="mb-4 rounded-[14px] px-4 py-3 flex flex-col gap-2"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.surfaceBorder}`,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wide mb-0.5" style={{ color: theme.textTertiary }}>
                本次挑战得分
              </div>
              <div className="text-[22px] font-bold tabular-nums" style={{ color: theme.accentBright }}>
                {w.sessionChallenge.score}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wide mb-0.5" style={{ color: theme.textTertiary }}>
                完成度
              </div>
              <div className="text-[22px] font-bold tabular-nums" style={{ color: theme.text }}>
                {w.sessionChallenge.completionRate}%
              </div>
            </div>
          </div>
          <p
            className="text-center text-[14px] font-semibold leading-snug pt-1 border-t m-0"
            style={{ borderColor: theme.surfaceBorder, color: theme.accentBright }}
          >
            {w.sessionChallenge.badgeText}
          </p>
          {w.sessionChallenge.starLevel > 0 ? (
            <div
              className="flex items-center justify-center gap-2 pt-0.5"
              style={{ borderColor: theme.surfaceBorder }}
            >
              <span
                className="text-[18px] leading-none tracking-widest"
                style={{ color: theme.accentBright }}
                aria-hidden
              >
                {'★'.repeat(w.sessionChallenge.starLevel)}
              </span>
              <span className="text-[12px] font-medium" style={{ color: theme.textSecondary }}>
                {w.sessionChallenge.starLevel}星评价
              </span>
            </div>
          ) : null}
        </div>

        <WorkoutControls
          mode={w.exercise.mode}
          resting={w.resting}
          isActive={w.isActive}
          flash={w.flash}
          onCount={w.handleCount}
          onToggleActive={w.handleToggleActive}
          onReset={w.handleReset}
          onSave={w.saveWorkout}
          canSave={canSave}
        />

        <TargetRepsPicker
          mode={w.exercise.mode}
          options={w.exercise.targetOptions}
          targetReps={w.targetReps}
          onSelect={w.setTargetRepsAndClearCount}
        />

        <div className="mb-6">
          <ActivityCalendar records={w.mergedDayRecords} savedSessions={w.savedSessions} />
        </div>

        <div className="mt-5">
          <SetHistoryPanel exercise={w.exercise} sets={w.sets} weightKg={w.weightKg} />
        </div>

        <TrainingHistoryPanel entries={w.trainingHistory} />
      </div>
    </WorkoutLayout>
  );
}
