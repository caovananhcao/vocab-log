export type Mood = 'happy' | 'neutral' | 'tired';

export type PartOfSpeech = 'N' | 'V' | 'Adj' | 'Adv' | 'Phrase' | 'Collocation' | 'Idiom';

export type PracticeRating = 'got' | 'almost' | 'forgot';

export interface VocabEntry {
  id: string;
  word: string;
  meaning: string;
  fn: PartOfSpeech | '';
  example: string;
  note: string;
  mastered: boolean;
  pronunciationAccent?: 'US' | 'UK';
  transcript?: string;
  ipa?: string;
  practiceRating?: PracticeRating;
}

export interface Session {
  id: string;
  date: string;
  topic: string;
  mood: Mood;
  timeSpent: number;
  entries: VocabEntry[];
  createdAt: string;
}
