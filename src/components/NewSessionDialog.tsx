import { useState } from 'react';
import { Session, Mood } from '@/types/vocab';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/storage';
import { X, Smile, Meh, Moon } from 'lucide-react';

interface Props {
  onSave: (session: Session) => void;
  onClose: () => void;
}

const moods: { value: Mood; icon: React.ReactNode; label: string }[] = [
  { value: 'happy', icon: <Smile size={20} />, label: 'Happy' },
  { value: 'neutral', icon: <Meh size={20} />, label: 'Neutral' },
  { value: 'tired', icon: <Moon size={20} />, label: 'Tired' },
];

export function NewSessionDialog({ onSave, onClose }: Props) {
  const [topic, setTopic] = useState('');
  const [mood, setMood] = useState<Mood>('happy');
  const [timeSpent, setTimeSpent] = useState(30);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSave({
      id: generateId(),
      date,
      topic: topic.trim(),
      mood,
      timeSpent,
      entries: [],
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="notebook-card max-w-md w-full space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-handwriting text-2xl">New Session ✏️</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="notebook-input w-full mt-1"
              placeholder="e.g., Academic Writing"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="notebook-input w-full mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Time (minutes)</label>
              <input
                type="number"
                value={timeSpent}
                onChange={e => setTimeSpent(Number(e.target.value))}
                min={1}
                className="notebook-input w-full mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Mood</label>
            <div className="flex gap-2 mt-2">
              {moods.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-sm ${
                    mood === m.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!topic.trim()}>
            Create Session
          </Button>
        </form>
      </div>
    </div>
  );
}
