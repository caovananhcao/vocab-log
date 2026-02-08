import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSessions';
import { VocabEntry, PracticeRating } from '@/types/vocab';
import { VocabEntryRow } from '@/components/VocabEntryRow';
import { PracticeMode } from '@/components/PracticeMode';
import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/storage';
import { ArrowLeft, Plus, Play, Smile, Meh, Moon, Trash2 } from 'lucide-react';
import { deleteSession } from '@/lib/storage';
import { Progress } from '@/components/ui/progress';
import { MilestoneMessage } from '@/components/MilestoneMessage';

type Filter = 'all' | 'mastered' | 'unmastered';

const moodIcons = {
  happy: <Smile size={18} className="text-success" />,
  neutral: <Meh size={18} className="text-accent" />,
  tired: <Moon size={18} className="text-muted-foreground" />,
};

const SessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session, update, updateEntry, addEntry, removeEntry } = useSession(id!);
  const [filter, setFilter] = useState<Filter>('all');
  const [practicing, setPracticing] = useState(false);
  const [accent, setAccent] = useState<'US' | 'UK'>('US');

  const createEmptyEntry = useCallback((): VocabEntry => ({
    id: generateId(),
    word: '',
    meaning: '',
    fn: '',
    example: '',
    note: '',
    mastered: false,
  }), []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Session not found</p>
          <Button variant="outline" onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const filteredEntries = session.entries.filter(e => {
    if (filter === 'mastered') return e.mastered;
    if (filter === 'unmastered') return !e.mastered;
    return true;
  });

  const mastered = session.entries.filter(e => e.mastered).length;
  const total = session.entries.length;

  const handleAddEntry = () => {
    addEntry(createEmptyEntry());
  };

  const handleDeleteSession = () => {
    if (confirm('Delete this session and all its entries?')) {
      deleteSession(session.id);
      navigate('/');
    }
  };

  const handlePracticeRatings = (ratings: Record<string, PracticeRating>) => {
    Object.entries(ratings).forEach(([entryId, rating]) => {
      updateEntry(entryId, { practiceRating: rating });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold font-handwriting truncate">{session.topic}</h1>
              {moodIcons[session.mood]}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {session.date} · {session.timeSpent} min · {mastered}/{total} mastered
            </p>
          </div>
        </div>

        {/* Progress bar + milestone */}
        {total > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Progress value={(mastered / total) * 100} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground font-medium shrink-0">
                {mastered}/{total}
              </span>
            </div>
            <MilestoneMessage mastered={mastered} total={total} />
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            {(['all', 'unmastered', 'mastered'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 capitalize transition-colors ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Accent toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden text-sm ml-auto">
            {(['US', 'UK'] as const).map(a => (
              <button
                key={a}
                onClick={() => setAccent(a)}
                className={`px-3 py-1.5 transition-colors ${
                  accent === a ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary'
                }`}
              >
                🔊 {a}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={() => setPracticing(true)} className="gap-1.5" disabled={total === 0}>
            <Play size={14} /> Practice
          </Button>

          <Button variant="ghost" size="sm" onClick={handleDeleteSession} className="text-destructive hover:text-destructive">
            <Trash2 size={14} />
          </Button>
        </div>

        {/* Entries */}
        <div className="space-y-2">
          {filteredEntries.map((entry, i) => (
            <VocabEntryRow
              key={entry.id}
              entry={entry}
              index={session.entries.indexOf(entry)}
              accent={accent}
              onChange={(updates) => updateEntry(entry.id, updates)}
              onDelete={() => removeEntry(entry.id)}
              onEnterOnLast={handleAddEntry}
              isLast={i === filteredEntries.length - 1}
            />
          ))}
        </div>

        {/* Add button */}
        <Button variant="outline" onClick={handleAddEntry} className="w-full border-dashed gap-1.5">
          <Plus size={16} /> Add Word
        </Button>
      </div>

      {practicing && (
        <PracticeMode
          session={session}
          accent={accent}
          onClose={() => setPracticing(false)}
          onUpdateRatings={handlePracticeRatings}
        />
      )}
    </div>
  );
};

export default SessionPage;
