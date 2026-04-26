export function calculateStreak(completions: string[], today?: string): number {
  if (!completions || completions.length === 0) return 0;

  const sortedCompletions = [...completions].sort((a, b) => b.localeCompare(a));
  const referenceDateStr = today || new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let currentRef = new Date(referenceDateStr);

  // If not completed today, check if it was completed yesterday to continue streak
  if (!sortedCompletions.includes(referenceDateStr)) {
    currentRef.setDate(currentRef.getDate() - 1);
    const yesterdayStr = currentRef.toISOString().split('T')[0];
    if (!sortedCompletions.includes(yesterdayStr)) {
      return 0;
    }
  }

  while (true) {
    const dStr = currentRef.toISOString().split('T')[0];
    if (sortedCompletions.includes(dStr)) {
      streak++;
      currentRef.setDate(currentRef.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
