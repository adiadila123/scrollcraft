'use client';
import { persistentStore } from './store';

/** The reader's own project, typed once and filled into every prompt that has a matching [slot]. */
export type Project = { subject: string; audience: string; action: string };

export const project = persistentStore<Project>('sc-project', { subject: '', audience: '', action: '' });
