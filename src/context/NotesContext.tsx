import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { NoteItem } from '../types';
import { generateNotes } from '../data/noteGenerator';
import { uid } from '../lib/random';

interface NotesContextValue {
  notes: NoteItem[];
  addNote: (n: Omit<NoteItem, 'id' | 'createdAt' | 'pinned'> & { pinned?: boolean }) => NoteItem;
  removeNote: (id: string) => void;
  togglePin: (id: string) => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => generateNotes(324));

  const addNote: NotesContextValue['addNote'] = useCallback((n) => {
    const note: NoteItem = {
      id: uid(),
      createdAt: Date.now(),
      pinned: n.pinned ?? false,
      title: n.title,
      body: n.body,
      tags: n.tags,
      hex: n.hex,
      origin: n.origin,
    };
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }, []);

  const value = useMemo(() => ({ notes, addNote, removeNote, togglePin }), [notes, addNote, removeNote, togglePin]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
