import { Session } from '@/types/vocab';

const STORAGE_KEY = 'vocab-log-sessions';

export function getSessions(): Session[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSession(id: string): Session | undefined {
  return getSessions().find(s => s.id === id);
}

export function saveSession(session: Session): void {
  const sessions = getSessions();
  const idx = sessions.findIndex(s => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.push(session);
  }
  saveSessions(sessions);
}

export function deleteSession(id: string): void {
  saveSessions(getSessions().filter(s => s.id !== id));
}

export function exportJSON(): string {
  return JSON.stringify(getSessions(), null, 2);
}

export function importJSON(json: string): Session[] {
  const sessions = JSON.parse(json) as Session[];
  saveSessions(sessions);
  return sessions;
}

export function exportCSV(): string {
  const sessions = getSessions();
  const rows = ['Session Date,Topic,Mood,Time (min),No.,Word/Phrase,Meaning,Function,Example,Note,Mastered'];
  sessions.forEach(s => {
    s.entries.forEach((e, i) => {
      const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
      rows.push([
        s.date, escape(s.topic), s.mood, s.timeSpent,
        i + 1, escape(e.word), escape(e.meaning), e.fn,
        escape(e.example), escape(e.note), e.mastered ? 'Yes' : 'No'
      ].join(','));
    });
  });
  return rows.join('\n');
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
