import type { Profile } from './authService';

export function appendJournalNote(profile: Profile, day: number, text: string): Profile {
  if(!text.trim()) return profile;
  return {
    ...profile,
    journal:{...profile.journal,[day]:''},
    journalNotes:{...profile.journalNotes,[day]:[
      ...(profile.journalNotes[day] || []),
      {id:globalThis.crypto?.randomUUID?.() || `note-${day}-${(profile.journalNotes[day]?.length || 0)+1}-${Date.now().toString(36)}`,text,createdAt:Date.now()},
    ]},
  };
}
