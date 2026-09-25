import {
  SiteSettings,
  MangaRelease,
  Region,
  Character,
  StoryArc,
  MysteryFile,
  GalleryItem,
  TrailerItem,
} from '../types/haikai';
import dbJson from '../../data/haikai_db.json';

export const DEFAULT_SETTINGS: SiteSettings = dbJson.settings as SiteSettings;
export const DEFAULT_MANGA_RELEASE: MangaRelease = dbJson.mangaRelease as MangaRelease;
export const REGIONS: Region[] = dbJson.regions as Region[];
export const CHARACTERS: Character[] = dbJson.characters as Character[];
export const STORY_ARCS: StoryArc[] = dbJson.storyArcs as StoryArc[];
export const MYSTERY_FILES: MysteryFile[] = dbJson.mysteries as MysteryFile[];
export const GALLERY_ITEMS: GalleryItem[] = dbJson.galleryItems as GalleryItem[];
export const DEFAULT_TRAILERS: TrailerItem[] = [
  {
    id: 'pv-01',
    title: 'HAIKAI — Official Teaser PV 01: The Drowned Truth',
    japanese: '灰海 始動特報 — 溺れた真実',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '/assets/manga_vol_01_cover.webp',
    duration: '01:32',
    releaseDate: '2026',
    description: 'Seventeen-year-old salvage diver Nero Vale discovers an ancient pre-Flood bronze capsule at the midnight shelf break, triggering the Crownlands imperial manhunt.',
    category: 'Official Teaser',
    status: 'Published',
    displayOrder: 0,
  },
  {
    id: 'pv-02',
    title: 'Main Cinematic Trailer: The Sea of Ash & The First Flood',
    japanese: '本予告第一弾 — 灰の境界線',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '/assets/manga_vol_01_cover.webp',
    duration: '02:18',
    releaseDate: '2026',
    description: 'Imperial cartographer Eira Voss reveals that seventy thousand people died defending empty water on false maps. The boundary at 82° South is expanding.',
    category: 'Main Trailer',
    status: 'Published',
    displayOrder: 1,
  },
  {
    id: 'pv-03',
    title: 'Character PV 01: Nero Vale & The Midnight Shelf',
    japanese: 'キャラクターPV 01 — ネロ・ヴェイル',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '/assets/manga_vol_01_cover.webp',
    duration: '00:58',
    releaseDate: '2026',
    description: 'A close examination of salvage diver Nero Vale: his silence, his lung capacity tests, and the forbidden dive 402.',
    category: 'Character PV',
    status: 'Published',
    displayOrder: 2,
  },
];

export const TRAILERS: TrailerItem[] =
  ((dbJson as any).trailers && (dbJson as any).trailers.length > 0)
    ? (dbJson as any).trailers
    : DEFAULT_TRAILERS;

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

