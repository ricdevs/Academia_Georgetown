/** Two ALTEA TALENT courses per live category, linked to official flyers. */

export type AlteaCourse = {
  category: string;
  title: string;
  href: string;
  image: string;
};

function flyer(title: string): string {
  return `https://alteatalent.com/flyer/${encodeURIComponent(title)}`;
}

function image(slug: string): string {
  return `/images/altea/${slug}.png`;
}

export const alteaCourses: AlteaCourse[] = [
  {
    category: 'Business & Management',
    title: 'Management & Leadership',
    href: flyer('Management & Leadership'),
    image: image('management-and-leadership'),
  },
  {
    category: 'Business & Management',
    title: 'Finance & Accounting',
    href: flyer('Finance & Accounting'),
    image: image('finance-and-accounting'),
  },
  {
    category: 'Consulting',
    title: 'Financial Advisory & Corporate Finance',
    href: flyer('Financial Advisory & Corporate Finance'),
    image: image('financial-advisory-and-corporate-finance'),
  },
  {
    category: 'Consulting',
    title: 'Audit & Accounting',
    href: flyer('Audit & Accounting'),
    image: image('audit-and-accounting'),
  },
  {
    category: 'Engineering',
    title: 'Mechanical Engineering',
    href: flyer('Mechanical Engineering'),
    image: image('mechanical-engineering'),
  },
  {
    category: 'Engineering',
    title: 'Civil Engineering',
    href: flyer('Civil Engineering'),
    image: image('civil-engineering'),
  },
  {
    category: 'Healthcare',
    title: 'Nursing',
    href: flyer('Nursing'),
    image: image('nursing'),
  },
  {
    category: 'Healthcare',
    title: 'Medicine',
    href: flyer('Medicine'),
    image: image('medicine'),
  },
  {
    category: 'Industrial Sectors',
    title: 'Automotive & EV Industry',
    href: flyer('Automotive & EV Industry'),
    image: image('automotive-and-ev-industry'),
  },
  {
    category: 'Industrial Sectors',
    title: 'Pharmaceutical & Biotechnology Industry',
    href: flyer('Pharmaceutical & Biotechnology Industry'),
    image: image('pharmaceutical-and-biotechnology-industry'),
  },
  {
    category: 'Science',
    title: 'Biology & Life Sciences',
    href: flyer('Biology & Life Sciences'),
    image: image('biology-and-life-sciences'),
  },
  {
    category: 'Science',
    title: 'Genetics & Genomics',
    href: flyer('Genetics & Genomics'),
    image: image('genetics-and-genomics'),
  },
  {
    category: 'Energy & Environment',
    title: 'Renewable Energy & Clean Technologies',
    href: flyer('Renewable Energy & Clean Technologies'),
    image: image('renewable-energy-and-clean-technologies'),
  },
  {
    category: 'Energy & Environment',
    title: 'Environmental Engineering',
    href: flyer('Environmental Engineering'),
    image: image('environmental-engineering'),
  },
  {
    category: 'Information Technology (IT)',
    title: 'ID Verification & Biometrics',
    href: flyer('ID Verification & Biometrics'),
    image: image('id-verification-and-biometrics'),
  },
  {
    category: 'Information Technology (IT)',
    title: 'Software Engineering',
    href: flyer('Software Engineering'),
    image: image('software-engineering'),
  },
  {
    category: 'Public Administration',
    title: 'Justice & Legal Administration',
    href: flyer('Justice & Legal Administration'),
    image: image('justice-and-legal-administration'),
  },
  {
    category: 'Public Administration',
    title: 'Police & Law Enforcement',
    href: flyer('Police & Law Enforcement'),
    image: image('police-and-law-enforcement'),
  },
  {
    category: 'Architecture & Design',
    title: 'Architecture',
    href: flyer('Architecture'),
    image: image('architecture'),
  },
  {
    category: 'Architecture & Design',
    title: 'Architecture & Design',
    href: flyer('Architecture & Design'),
    image: image('architecture-and-design'),
  },
];

export const alteaCarouselItems = alteaCourses.map(({ href, title, image: imageSrc }) => ({
  href,
  title,
  image: imageSrc,
}));
