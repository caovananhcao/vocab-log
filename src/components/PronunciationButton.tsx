import { Volume2, VolumeX } from 'lucide-react';
import { useState, useRef } from 'react';

interface Props {
  word: string;
  accent: 'US' | 'UK';
}

export function PronunciationButton({ word, accent }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  if (!('speechSynthesis' in window)) {
    return (
      <span className="text-xs text-muted-foreground" title="Pronunciation not supported on this browser">
        🔇
      </span>
    );
  }

  const handleClick = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = accent === 'UK' ? 'en-GB' : 'en-US';
    utter.rate = 0.9;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    speechSynthesis.speak(utter);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md text-primary hover:bg-primary/10 transition-colors"
      title={speaking ? 'Stop' : `Pronounce (${accent})`}
      type="button"
    >
      {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
    </button>
  );
}
