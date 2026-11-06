'use client';
import { persistentStore } from './store';

/** Reading progress: which chapters were finished, which one was open last, and the section being read there. */
export type Progress = { done: string[]; last?: string; at?: { chapter: string; id: string; label: string } };

const store = persistentStore<Progress>('sc-progress', { done: [] });

export function markVisited(id: string) {
  const p = store.get();
  if (p.last !== id) store.set({ ...p, last: id });
}

export function markDone(id: string) {
  const p = store.get();
  if (!p.done.includes(id)) store.set({ ...p, done: [...p.done, id] });
}

export function markSection(chapter: string, id: string, label: string) {
  const p = store.get();
  if (p.at?.chapter !== chapter || p.at.id !== id) store.set({ ...p, at: { chapter, id, label } });
}

export const useProgress = store.use;
