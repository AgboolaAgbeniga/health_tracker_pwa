export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!completions || completions.length === 0) return 0;

  const uniqueDates = Array.from(new Set(completions)).sort((a, b) => b.localeCompare(a));
  const referenceDate = today || new Date().toISOString().split('T')[0];

  if (!uniqueDates.includes(referenceDate)) return 0;

  let streak = 0;
  const ref = new Date(referenceDate);

  while (true) {
    const dStr = ref.toISOString().split('T')[0];
    if (uniqueDates.includes(dStr)) {
      streak++;
      ref.setDate(ref.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
