const STREAK_KEY = 'vocab-log-streak';

interface StreakData {
  dates: string[]; // ISO date strings (YYYY-MM-DD)
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function getStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : { dates: [] };
  } catch {
    return { dates: [] };
  }
}

function saveStreakData(data: StreakData): void {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

export function recordStudyDay(): void {
  const data = getStreakData();
  const t = today();
  if (!data.dates.includes(t)) {
    data.dates.push(t);
    saveStreakData(data);
  }
}

export function getStreakCount(): number {
  const data = getStreakData();
  if (data.dates.length === 0) return 0;

  const sorted = [...new Set(data.dates)].sort().reverse();
  const t = today();

  // Streak must include today or yesterday to be active
  if (sorted[0] !== t) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (sorted[0] !== yesterday.toISOString().slice(0, 10)) return 0;
  }

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i]);
    const prev = new Date(sorted[i + 1]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
