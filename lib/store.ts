'use client';
import { useSyncExternalStore } from 'react';
import { readStore, writeStore } from './motion';

/**
 * A value kept in localStorage and shared by every component that reads it, including other open tabs.
 * The server and the first client render see the fallback, so hydration always matches.
 */
export function persistentStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let cache: T | undefined;

  const get = () => (cache === undefined ? (cache = readStore<T>(key, fallback)) : cache);
  const set = (next: T) => {
    cache = next;
    writeStore(key, next);
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      cache = undefined;
      l();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(l);
      window.removeEventListener('storage', onStorage);
    };
  };
  const use = () => useSyncExternalStore(subscribe, get, () => fallback);

  return { get, set, use };
}
