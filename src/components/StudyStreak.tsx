import { useEffect, useState } from 'react';
import { getStreakCount, recordStudyDay } from '@/lib/streak';
import { Flame } from 'lucide-react';

export function StudyStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    recordStudyDay();
    setStreak(getStreakCount());
  }, []);

  if (streak < 1) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Flame size={16} className="text-accent" />
      <span>
        You've studied vocabulary{' '}
        <span className="font-semibold text-foreground">{streak} day{streak !== 1 ? 's' : ''}</span>
        {streak > 1 ? ' in a row' : ' today'}. Keep it up!
      </span>
    </div>
  );
}
