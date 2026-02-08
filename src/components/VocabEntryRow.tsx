import { VocabEntry, PartOfSpeech } from '@/types/vocab';
import { Trash2 } from 'lucide-react';
import { PronunciationButton } from './PronunciationButton';
import { Checkbox } from '@/components/ui/checkbox';

const FN_OPTIONS: PartOfSpeech[] = ['N', 'V', 'Adj', 'Adv', 'Phrase', 'Collocation', 'Idiom'];

interface Props {
  entry: VocabEntry;
  index: number;
  accent: 'US' | 'UK';
  onChange: (updates: Partial<VocabEntry>) => void;
  onDelete: () => void;
  onEnterOnLast: () => void;
  isLast: boolean;
}

export function VocabEntryRow({ entry, index, accent, onChange, onDelete, onEnterOnLast, isLast }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter' && field === 'note' && isLast) {
      e.preventDefault();
      onEnterOnLast();
    }
  };

  return (
    <div className="notebook-card !p-3 group">
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold text-muted-foreground mt-2.5 w-6 text-right shrink-0">
          {index + 1}
        </span>
        
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_auto_1.5fr_1fr] gap-2">
          {/* Word */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={entry.word}
              onChange={e => onChange({ word: e.target.value })}
              placeholder="Word / Phrase"
              className="notebook-input w-full font-semibold"
            />
            {entry.word && <PronunciationButton word={entry.word} accent={accent} />}
          </div>

          {/* Meaning */}
          <input
            type="text"
            value={entry.meaning}
            onChange={e => onChange({ meaning: e.target.value })}
            placeholder="Meaning"
            className="notebook-input w-full"
          />

          {/* Fn dropdown */}
          <select
            value={entry.fn}
            onChange={e => onChange({ fn: e.target.value as PartOfSpeech })}
            className="notebook-input w-full sm:w-24"
          >
            <option value="">Fn</option>
            {FN_OPTIONS.map(fn => (
              <option key={fn} value={fn}>{fn}</option>
            ))}
          </select>

          {/* Example */}
          <input
            type="text"
            value={entry.example}
            onChange={e => onChange({ example: e.target.value })}
            placeholder="Example sentence"
            className="notebook-input w-full italic"
          />

          {/* Note */}
          <input
            type="text"
            value={entry.note}
            onChange={e => onChange({ note: e.target.value })}
            onKeyDown={e => handleKeyDown(e, 'note')}
            placeholder="Note"
            className="notebook-input w-full"
          />
        </div>

        <div className="flex items-center gap-2 mt-2 shrink-0">
          <Checkbox
            checked={entry.mastered}
            onCheckedChange={(v) => onChange({ mastered: !!v })}
            className="data-[state=checked]:bg-success data-[state=checked]:border-success"
          />
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
            type="button"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {entry.transcript && (
        <div className="ml-9 mt-1">
          <span className="text-xs text-muted-foreground">
            {entry.ipa ? `/${entry.ipa}/` : `Transcript: ${entry.transcript}`}
          </span>
        </div>
      )}
    </div>
  );
}
