/** Original Divi card images (Wayback / production uploads). */

export const certCardMedia = [
  { href: '/b2-first-certificate/', title: 'B2 First', image: '/images/certs/b2-first.jpg' },
  { href: '/c1-advanced/', title: 'C1 Advanced', image: '/images/certs/c1-advanced.jpg' },
  { href: '/c2-proficiency/', title: 'C2 Proficiency', image: '/images/certs/c2-proficiency.jpg' },
  { href: '/toefl-ibt/', title: 'TOEFL iBT ®', image: '/images/certs/toefl-ibt.jpg' },
  { href: '/aptis-general/', title: 'APTIS General', image: '/images/certs/aptis-general.jpg' },
  { href: '/aptis-advanced/', title: 'APTIS Advanced', image: '/images/certs/aptis-advanced.jpg' },
] as const;

const pecFiles = [
  '00-econo.jpg',
  '01-curso-ensino-medio-humanas.jpg',
  '02-busines.jpg',
  '03-nursing.jpg',
  '04-makas.jpg',
  '05-papr.jpg',
  '06-acchd.jpg',
  '07-medicine.jpg',
  '08-mecha.jpg',
  '09-european-parliament-2-1024x614-1.jpg',
  '10-eks.jpg',
  '11-chemis.jpg',
  '12-robos.jpg',
  '13-aaero.jpg',
  '14-civl.jpg',
  '15-lou.jpg',
  '16-electro.jpg',
  '17-manufac.jpg',
  '18-biiology.jpg',
  '19-aastronomy.jpg',
  '20-phys.jpg',
  '21-georgraphy.jpg',
  '22-journasz.jpg',
  '23-phylo-1.jpg',
  '24-tool-inc-fuiexaKxlhk-unsplash-1-1.jpg',
  '25-wine.jpg',
  '26-cardioprimarycare-hero-1.jpg',
  '27-civil.jpg',
  '28-elec.jpg',
  '29-defense.jpg',
  '30-aagg.jpg',
  '31-feed.jpg',
  '32-cullinan.jpg',
  '33-finan.jpeg',
  '34-interior.jpg',
  '35-image-12.jpg',
  '36-adfsgasdgf-aa12341o-1.jpg',
  '37-vacation-rental.jpg',
];

/** Map program index to original Supreme Card Carousel image (child 18 was missing). */
export function pecImage(index: number): string {
  if (index === 12) return '/images/pec/16-electro.jpg';
  if (index < 12) return `/images/pec/${pecFiles[index]}`;
  if (index < 39) return `/images/pec/${pecFiles[index - 1]}`;
  return `/images/pec/${pecFiles[index % pecFiles.length]}`;
}

export const missionIcons = [
  '/images/icons/mission-1.svg',
  '/images/icons/mission-2.svg',
  '/images/icons/mission-3.svg',
  '/images/icons/mission-4.svg',
  '/images/icons/mission-5.svg',
  '/images/icons/mission-6.svg',
] as const;
