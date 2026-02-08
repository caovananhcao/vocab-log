import { useState, useMemo } from 'react';
import { Session, VocabEntry, PracticeRating } from '@/types/vocab';
import { Button } from '@/components/ui/button';
import { X, Eye, ThumbsUp, Minus, ThumbsDown, RotateCcw } from 'lucide-react';
import { PronunciationButton } from './PronunciationButton';

interface Props {
  session: Session;
  accent: 'US' | 'UK';
  onClose: () => void;
  onUpdateRatings: (ratings: Record<string, PracticeRating>) => void;
}

export function PracticeMode({ session, accent, onClose, onUpdateRatings }: Props) {
  const entries = useMemo(() => 
    session.entries.filter(e => e.word.trim()),
    [session.entries]
  );
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<Record<string, PracticeRating>>({});
  const [finished, setFinished] = useState(false);

  if (entries.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="notebook-card max-w-md w-full text-center">
          <p className="text-muted-foreground mb-4">No vocabulary entries to practice.</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  const entry = entries[currentIdx];

  const rate = (rating: PracticeRating) => {
    const newRatings = { ...ratings, [entry.id]: rating };
    setRatings(newRatings);
    
    if (currentIdx < entries.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setRevealed(false);
    } else {
      setFinished(true);
      onUpdateRatings(newRatings);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setRevealed(false);
    setRatings({});
    setFinished(false);
  };

  if (finished) {
    const got = Object.values(ratings).filter(r => r === 'got').length;
    const almost = Object.values(ratings).filter(r => r === 'almost').length;
    const forgot = Object.values(ratings).filter(r => r === 'forgot').length;

    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="notebook-card max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-bold font-handwriting">Practice Complete! 🎉</h2>
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{got}</div>
              <div className="text-muted-foreground">Got it</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{almost}</div>
              <div className="text-muted-foreground">Almost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{forgot}</div>
              <div className="text-muted-foreground">Forgot</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={restart}>
              <RotateCcw size={16} className="mr-2" /> Again
            </Button>
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="notebook-card max-w-lg w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {currentIdx + 1} / {entries.length}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx) / entries.length) * 100}%` }}
          />
        </div>

        <div className="text-center space-y-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-3xl font-bold font-handwriting">{entry.word}</h3>
            <PronunciationButton word={entry.word} accent={accent} />
          </div>
          {entry.fn && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {entry.fn}
            </span>
          )}
          {entry.transcript && (
            <p className="text-xs text-muted-foreground">{entry.ipa ? `/${entry.ipa}/` : entry.transcript}</p>
          )}
        </div>

        {!revealed ? (
          <div className="text-center">
            <Button variant="outline" onClick={() => setRevealed(true)} className="gap-2">
              <Eye size={16} /> Reveal
            </Button>
          </div>
        ) : (
          <div className="space-y-3 bg-secondary/50 rounded-lg p-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase">Meaning</span>
              <p className="mt-1">{entry.meaning || '—'}</p>
            </div>
            {entry.example && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase">Example</span>
                <p className="mt-1 italic text-muted-foreground">{entry.example}</p>
              </div>
            )}
          </div>
        )}

        {revealed && (
          <div className="flex gap-3 justify-center pt-2">
            <Button size="sm" className="practice-btn-got gap-1.5" onClick={() => rate('got')}>
              <ThumbsUp size={14} /> Got it
            </Button>
            <Button size="sm" className="practice-btn-almost gap-1.5" onClick={() => rate('almost')}>
              <Minus size={14} /> Almost
            </Button>
            <Button size="sm" className="practice-btn-forgot gap-1.5" onClick={() => rate('forgot')}>
              <ThumbsDown size={14} /> Forgot
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
