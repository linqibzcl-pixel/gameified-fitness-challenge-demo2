/** Apple Watch–style fitness UI: deep gray surfaces + Move ring green */
export const theme = {
  bgGradient: 'linear-gradient(165deg, #000000 0%, #1c1c1e 45%, #2c2c2e 100%)',
  fitnessHeroGradient:
    'radial-gradient(120% 80% at 50% -10%, rgba(48, 209, 88, 0.18) 0%, transparent 55%), linear-gradient(180deg, #0d0d0f 0%, #000000 40%, #0a0a0c 100%)',
  surface: 'rgba(44, 44, 46, 0.65)',
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  accent: '#30d158',
  accentBright: '#5cff7a',
  accentMuted: 'rgba(48, 209, 88, 0.18)',
  accentBorder: 'rgba(48, 209, 88, 0.35)',
  text: '#ffffff',
  textSecondary: '#8e8e93',
  textTertiary: '#636366',
  inactive: '#48484a',
} as const;

export const REF_WEIGHT_KG = 70;
export const CALORIES_PER_SQUAT_AT_REF = 0.32;
/** Extra kcal per finished set (transitions / setup), on top of rep-based estimate */
export const KCAL_PER_COMPLETED_SET = 1.8;

export function estimateSquatKcal(reps: number, weightKg: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  return Math.round(reps * CALORIES_PER_SQUAT_AT_REF * (weightKg / REF_WEIGHT_KG) * 10) / 10;
}

export function estimateWorkoutKcal(totalReps: number, completedSets: number, weightKg: number): number {
  const fromReps = estimateSquatKcal(totalReps, weightKg);
  const fromSets = Math.max(0, completedSets) * KCAL_PER_COMPLETED_SET;
  return Math.round((fromReps + fromSets) * 10) / 10;
}

export function sessionSetBonusKcal(completedSets: number): number {
  return Math.round(Math.max(0, completedSets) * KCAL_PER_COMPLETED_SET * 10) / 10;
}
