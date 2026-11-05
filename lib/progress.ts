'use client';
import { persistentStore } from './store';

/** Reading progress: which chapters were finished and which one was open last. */
export type Progress = { done: string[]; last?: string };

const store = persistentStore<Progress>('sc-progress', { done: [] });

export function markVisited(id: string) {
  const p = store.get();
  if (p.last !== id) store.set({ ...p, last: id });
}

export function markDone(id: string) {
  const p = store.get();
  if (!p.done.includes(id)) store.set({ ...p, done: [...p.done, id] });
}

export const useProgress = store.use;
