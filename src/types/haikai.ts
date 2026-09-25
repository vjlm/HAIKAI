export interface Region {
  id: string;
  number: string;
  name: string;
  japanese: string;
  tagline: string;
  visualSummary: string;
  quote: string;
  government: string;
  powerSource: string;
  ideology: string;
  description: string;
  depthRecord: string;
  hazards: string[];
  keyLocations: string[];
}

export interface Character {
  id: string;
  name: string;
  japanese: string;
  age: number | string;
  role: string;
  origin: string;
  quote: string;
  appearance: string;
  description: string;
  highlight: string;
  knownFor: string[];
  classifiedNote?: string;
  secretRevealed?: string;
}

export interface Relationship {
  id: string;
  pair: [string, string];
  label: string;
  quote: string;
  dynamic: string;
  tension: string;
}

export interface Oath {
  id: string;
  category: 'Memory' | 'Lifespan' | 'Relationships' | 'Senses' | 'Identity' | 'Freedom';
  title: string;
  japanese: string;
  vow: string;
  sacrifice: string;
  conviction: string;
  unlockedPower: string;
  consequenceOfBreak: string;
  bearer: string;
}

export interface StoryArc {
  number: string;
  arcNumber: number;
  title: string;
  japanese: string;
  synopsis: string;
  quote: string;
  depthLevel: string;
  keyArtifact: string;
}

export interface MysteryFile {
  id: string;
  fileNumber: string;
  title: string;
  japanese: string;
  classification: string;
  description: string;
  dialogue?: { speaker: string; text: string }[];
  inconsistencies: string[];
  redactedLore: string;
}

export interface WarRecord {
  id: string;
  recordId: string;
  date: string;
  title: string;
  department: string;
  body: string;
  handwrittenNote: string;
  stamps: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  japanese: string;
  category: 'CHARACTERS' | 'LANDSCAPES' | 'THE SEA' | 'RUINS' | 'WAR' | 'CONCEPT ART';
  description: string;
  aspectRatio: '16:9' | '3:4' | '4:3';
  visualType: string;
}
