import { useState, useCallback } from 'react';
import { Session, VocabEntry } from '@/types/vocab';
import * as storage from '@/lib/storage';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(storage.getSessions);

  const refresh = useCallback(() => {
    setSessions(storage.getSessions());
  }, []);

  const addSession = useCallback((session: Session) => {
    storage.saveSession(session);
    refresh();
  }, [refresh]);

  const updateSession = useCallback((session: Session) => {
    storage.saveSession(session);
    refresh();
  }, [refresh]);

  const removeSession = useCallback((id: string) => {
    storage.deleteSession(id);
    refresh();
  }, [refresh]);

  const importData = useCallback((json: string) => {
    storage.importJSON(json);
    refresh();
  }, [refresh]);

  return { sessions, addSession, updateSession, removeSession, importData, refresh };
}

export function useSession(id: string) {
  const [session, setSession] = useState<Session | undefined>(() => storage.getSession(id));

  const update = useCallback((updates: Partial<Session>) => {
    if (!session) return;
    const updated = { ...session, ...updates };
    storage.saveSession(updated);
    setSession(updated);
  }, [session]);

  const updateEntry = useCallback((entryId: string, updates: Partial<VocabEntry>) => {
    if (!session) return;
    const entries = session.entries.map(e => e.id === entryId ? { ...e, ...updates } : e);
    const updated = { ...session, entries };
    storage.saveSession(updated);
    setSession(updated);
  }, [session]);

  const addEntry = useCallback((entry: VocabEntry) => {
    if (!session) return;
    const updated = { ...session, entries: [...session.entries, entry] };
    storage.saveSession(updated);
    setSession(updated);
  }, [session]);

  const removeEntry = useCallback((entryId: string) => {
    if (!session) return;
    const updated = { ...session, entries: session.entries.filter(e => e.id !== entryId) };
    storage.saveSession(updated);
    setSession(updated);
  }, [session]);

  return { session, update, updateEntry, addEntry, removeEntry };
}
