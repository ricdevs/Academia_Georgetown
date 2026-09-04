import pec from './pec-programs.json';
import extracted from './extracted-pages.json';
import { seoLandings } from './site';

export { seoLandings };

export type PecProgram = (typeof pec)[number];

export const pecPrograms: PecProgram[] = pec;

export const pecBySlug = Object.fromEntries(pec.map((p) => [p.slug, p]));

export const certificates = [
  'b2-first-certificate',
  'c1-advanced',
  'c2-proficiency',
  'a2-ket',
  'b1-preliminary',
  'toefl-ibt',
  'aptis-general',
  'aptis-advanced',
] as const;

export type ExtractedPages = typeof extracted;

export const extractedPages: ExtractedPages = extracted;

export const landingBySlug = Object.fromEntries(seoLandings.map((l) => [l.slug, l]));

export const certCards = [
  { href: '/b2-first-certificate/', title: 'B2 First' },
  { href: '/c1-advanced/', title: 'C1 Advanced' },
  { href: '/c2-proficiency/', title: 'C2 Proficiency' },
  { href: '/toefl-ibt/', title: 'TOEFL iBT ®' },
  { href: '/aptis-general/', title: 'APTIS General' },
  { href: '/aptis-advanced/', title: 'APTIS Advanced' },
];

export const youthCertCards = [
  { href: '/a2-ket/', title: 'A2 Key (KET)' },
  { href: '/b1-preliminary/', title: 'B1 Preliminary (PET)' },
  { href: '/b2-first-certificate/', title: 'B2 First (FCE)' },
  { href: '/c1-advanced/', title: 'C1 Advanced (CAE)' },
];
