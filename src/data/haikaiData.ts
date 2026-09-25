import {
  SiteSettings,
  MangaRelease,
  Region,
  Character,
  StoryArc,
  MysteryFile,
  GalleryItem,
} from '../types/haikai';
import dbJson from '../../data/haikai_db.json';

export const DEFAULT_SETTINGS: SiteSettings = dbJson.settings as SiteSettings;
export const DEFAULT_MANGA_RELEASE: MangaRelease = dbJson.mangaRelease as MangaRelease;
export const REGIONS: Region[] = dbJson.regions as Region[];
export const CHARACTERS: Character[] = dbJson.characters as Character[];
export const STORY_ARCS: StoryArc[] = dbJson.storyArcs as StoryArc[];
export const MYSTERY_FILES: MysteryFile[] = dbJson.mysteries as MysteryFile[];
export const GALLERY_ITEMS: GalleryItem[] = dbJson.galleryItems as GalleryItem[];

export const RELATIONSHIPS: any[] = [
  {
    source: 'NERO VALE',
    target: 'EIRA VOSS',
    type: 'ALLIANCE // REPRESSED TENSION',
    desc: 'He trusts her maps; she fears his instinct. Neither will admit that surviving without the other has become unthinkable.',
    tag: 'CANON PAIRING',
  },
  {
    source: 'NERO VALE',
    target: 'CAEL ARDEN',
    type: 'MENTORSHIP // CAUTIONARY FATE',
    desc: 'Cael sees his younger self before the cordon wars. Nero refuses to end up drowned in cheap whiskey and regret.',
    tag: 'FRATERNAL',
  },
  {
    source: 'EIRA VOSS',
    target: 'CAEL ARDEN',
    type: 'MILITARY SHADOW // TREASON',
    desc: 'She represents the Crownlands command that condemned his regiment. He knows the secret orders her father signed.',
    tag: 'ANTAGONISM',
  },
];

export const OATHS: any[] = [
  {
    id: 'oath-depth',
    title: 'THE OATH OF DEPTH',
    swornBy: 'Salvage Divers',
    consequence: 'Never rise faster than the tide permits; in return, your lungs extract oxygen from suspended ash.',
    penalty: 'Immediate calcification of heart valves upon surfacing in panic.',
  },
  {
    id: 'oath-boundary',
    title: 'THE OATH OF THE BOUNDARY',
    swornBy: 'Cordon Garrison Officers',
    consequence: 'Never speak of what lies beyond latitude 82°; in return, blade wounds bleed silver and knit in hours.',
    penalty: 'Speaking a forbidden name turns your blood to vitreous sand within ninety heartbeats.',
  },
];

export const WAR_RECORDS: any[] = [
  {
    id: 'war-01',
    title: 'THE FALL OF FORTRESS ZERO',
    japanese: '要塞零落',
    date: 'Cordon Year 2991',
    description: 'Declassified imperial report regarding civilian scuttling.',
  },
];

export const HAIKAI_META: any = {
  title: 'HAIKAI — The Sea of Ash',
  japaneseTitle: '灰海',
  englishTitle: 'HAIKAI',
  subtitle: 'THE SEA OF ASH',
  tagline: '“Was this world ever meant to be saved?”',
  centralQuestion: '“Was this world ever meant to be saved?”',
  deeperQuestion: '“What lies beyond the quarantine?”',
};

