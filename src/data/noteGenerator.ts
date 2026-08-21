import type { NoteItem } from '../types';
import { choice, randInt, randomHueHex, uid } from '../lib/random';
import { ADJECTIVES, FIELDS, NOTE_OPENERS, NOUNS, TAGS, THINKERS, VERB_PHRASES } from './wordbanks';

function randomTitle(): string {
  return `${choice(ADJECTIVES)} ${choice(NOUNS)}`;
}

function randomBody(): string {
  const fieldA = choice(FIELDS);
  let fieldB = choice(FIELDS);
  while (fieldB === fieldA) fieldB = choice(FIELDS);
  const opener = choice(NOTE_OPENERS);
  const sentence = `a ${choice(ADJECTIVES).toLowerCase()} ${choice(NOUNS).toLowerCase()} that ${choice(VERB_PHRASES)} ${fieldA} and ${fieldB}, filtered through the residue of ${choice(THINKERS)}.`;
  return `${opener} ${sentence.charAt(0).toUpperCase() + sentence.slice(1)}`;
}

function randomTags(): string[] {
  const n = randInt(2, 4);
  const set = new Set<string>();
  while (set.size < n) set.add(choice(TAGS));
  return Array.from(set);
}

function randomTimestamp(): number {
  const now = Date.now();
  const spanMs = 1000 * 60 * 60 * 24 * 730; // ~2 years
  return now - Math.floor(Math.random() * spanMs);
}

export function generateNote(origin: NoteItem['origin'] = 'seed'): NoteItem {
  return {
    id: uid(),
    title: randomTitle(),
    body: randomBody(),
    tags: randomTags(),
    hex: randomHueHex(),
    createdAt: randomTimestamp(),
    pinned: false,
    origin,
  };
}

export function generateNotes(count: number): NoteItem[] {
  const notes: NoteItem[] = [];
  for (let i = 0; i < count; i++) notes.push(generateNote('seed'));
  return notes.sort((a, b) => b.createdAt - a.createdAt);
}
