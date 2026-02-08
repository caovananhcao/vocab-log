import { Sparkles, PartyPopper } from 'lucide-react';

interface Props {
  mastered: number;
  total: number;
}

export function MilestoneMessage({ mastered, total }: Props) {
  if (total === 0) return null;

  const pct = mastered / total;

  if (pct >= 1) {
    return (
      <div className="flex items-center gap-2 text-sm text-success font-medium px-3 py-2 rounded-lg bg-success/10">
        <PartyPopper size={16} />
        <span>All words in this session mastered!</span>
      </div>
    );
  }

  if (pct >= 0.5) {
    return (
      <div className="flex items-center gap-2 text-sm text-accent-foreground font-medium px-3 py-2 rounded-lg bg-accent/10">
        <Sparkles size={16} />
        <span>Nice progress! Over halfway there.</span>
      </div>
    );
  }

  return null;
}
