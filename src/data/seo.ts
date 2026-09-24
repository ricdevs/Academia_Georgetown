import pec from './pec-programs.json';
import { site } from './site';

export type SeoEntry = {
  title: string;
  description: string;
};

export const LOCAL_TITLE_SUFFIX = 'Academia de inglés en Pamplona | Academia Georgetown';

export const seoByPath: Record<string, SeoEntry> = {
  '/': {
    title: 'Academia Georgetown - Academia de Inglés en Pamplona',
    description: site.description,
  },
  '/academia-de-ingles-en-pamplona/': {
    title: `Academia de inglés en Pamplona | Academia Georgetown`,
    description:
      'Academia de inglés en Pamplona, entre UNAV y UPNA. Cursos presenciales u online, método Georgetown y preparación de certificados. Llama al 948 17 51 48.',
  },
  '/curso-de-ingles-en-pamplona/': {
    title: `Curso de inglés en Pamplona - ${LOCAL_TITLE_SUFFIX}`,
    description:
      'Curso de inglés en Pamplona adaptado a tu nivel: 12, 24 o 36 semanas, grupos de 9 y prueba de nivel. Presencial u online. Solicita información.',
  },
  '/certificado-de-ingles-en-pamplona/': {
    title: `Certificado de inglés en Pamplona - ${LOCAL_TITLE_SUFFIX}`,
    description:
      'Prepara Cambridge, TOEFL iBT® y APTIS en Pamplona. Centro examinador de TOEFL iBT® y APTIS. Elige el certificado y pide tu prueba de nivel.',
  },
  '/sacarse-el-b1-de-ingles-en-pamplona/': {
    title: `Sacarse el B1 de inglés en Pamplona - ${LOCAL_TITLE_SUFFIX}`,
    description:
      'Prepárate para el B1 Preliminary (PET) en Pamplona con seguimiento personalizado. Prueba de nivel y plan a tu ritmo. Contacta con Georgetown.',
  },
  '/sacarse-el-b2-de-ingles-en-pamplona/': {
    title: `Sacarse el B2 de inglés en Pamplona - ${LOCAL_TITLE_SUFFIX}`,
    description:
      'Prepárate para el B2 First (FCE) en Pamplona. Método Georgetown y ALTEA Labs para certificar el B2 en el menor tiempo. Solicita información.',
  },
  '/sacarse-el-c1-de-ingles-en-pamplona/': {
    title: `Sacarse el C1 de inglés en Pamplona - ${LOCAL_TITLE_SUFFIX}`,
    description:
      'Prepárate para el C1 Advanced (CAE) en Pamplona. Plan personalizado y profesorado experto para certificar el C1. Pide tu prueba de nivel.',
  },
  '/b2-first-certificate/': {
    title: 'Prepara el B2 First Certificate en la Academia Georgetown',
    description:
      'Preparación del B2 First (FCE) en Pamplona: evaluación inicial, ALTEA Labs y tutoría para speaking, writing, reading y listening. Infórmate.',
  },
  '/c1-advanced/': {
    title: 'Prepara el C1 Advanced CAE en la Academia Georgetown',
    description:
      'Preparación del C1 Advanced (CAE) en Pamplona para entornos académicos y profesionales. Seguimiento personalizado. Realiza la prueba de nivel.',
  },
  '/c2-proficiency/': {
    title: 'Prepara el C2 Proficiency (CPE) en la Academia Georgetown',
    description:
      'Preparación del C2 Proficiency (CPE) en Pamplona con rigor y profesorado experto. Plan a tu nivel. Contacta con Academia Georgetown.',
  },
  '/toefl-ibt/': {
    title: 'Prepara el examen TOEFL iBT® en la Academia Georgetown',
    description:
      'Prepárate y examínate del TOEFL iBT® en tu centro examinador de Pamplona. Enfoque por destrezas y seguimiento personalizado. Reserva información.',
  },
  '/aptis-general/': {
    title: 'Prepara el Aptis General (A1-C) en la Academia Georgetown',
    description:
      'Preparación APTIS General (A1–C) en Pamplona. Centro examinador APTIS. Resultados prácticos para el día a día. Pide tu prueba de nivel.',
  },
  '/aptis-advanced/': {
    title: 'Prepara el examen Aptis Advanced en la Academia Georgetown',
    description:
      'Preparación APTIS Advanced (B2–C2) en Pamplona. Centro examinador APTIS para contextos profesionales y académicos. Solicita información.',
  },
  '/a2-ket/': {
    title: 'Prepara el A2 Key (KET) en la Academia Georgetown',
    description:
      'Preparación del A2 Key (KET) en Pamplona para escolares y primeros certificados Cambridge. Grupos reducidos y prueba de nivel. Infórmate.',
  },
  '/b1-preliminary/': {
    title: 'Prepara el B1 Preliminary (PET) en la Academia Georgetown',
    description:
      'Preparación del B1 Preliminary (PET) en Pamplona. Camino hacia el B2 First con método Georgetown. Contacta y reserva tu prueba de nivel.',
  },
  '/ingles-para-estudiantes/': {
    title: 'Inglés para estudiantes universitarios en Pamplona | Academia Georgetown',
    description:
      'Inglés para universitarios y docentes en Pamplona: B2, C1 y TOEFL iBT® con método Georgetown. Presencial u online. Solicita información.',
  },
  '/ingles-profesional/': {
    title: 'Cursos de inglés para profesionales en Pamplona | Academia Georgetown',
    description:
      'Inglés profesional y técnico en Pamplona. APTIS, TOEFL iBT® y C1 para tu puesto. Grupos de 9 o particular. Llama al 948 17 51 48.',
  },
  '/ingles-para-jovenes/': {
    title: 'Cursos de inglés para jóvenes en Pamplona | Academia Georgetown',
    description:
      'Inglés para jóvenes y escolares en Pamplona: A2 Key, B1 Preliminary y B2 First. Plazas reducidas y prueba de nivel. Pide información.',
  },
  '/prueba-de-nivel/': {
    title: `Prueba de Nivel - ${LOCAL_TITLE_SUFFIX}`,
    description:
      'Haz la prueba de nivel de inglés de Academia Georgetown en Pamplona y recibe un plan realista. Reserva fecha o escríbenos al 948 17 51 48.',
  },
  '/contacto/': {
    title: `Contacto - ${LOCAL_TITLE_SUFFIX}`,
    description:
      'Contacta con Academia Georgetown en Iturrama 8, Pamplona. Un experto te llama para diseñar tu itinerario. Teléfono 948 17 51 48.',
  },
  '/contacto-upna/': {
    title: 'Contacto UPNA - Academia Georgetown',
    description:
      'Formulario de contacto para alumnos y candidatos de la UPNA. Academia Georgetown en Pamplona. Teléfono 948 17 51 48.',
  },
  '/matricula-y-financiacion/': {
    title: 'Matrícula y financiación - Academia Georgetown',
    description:
      'Información de matrícula y vías de financiación de Academia Georgetown en Pamplona. Consulta condiciones en el 948 17 51 48.',
  },
  '/contenido/': {
    title: 'Contenido de los programas - Academia Georgetown',
    description:
      'Contenido de los programas de inglés de Academia Georgetown. Revisa materias y pide el detalle en Pamplona o por teléfono.',
  },
  '/blog/': {
    title: 'Artículos e entrevistas - Blog Georgetown',
    description:
      'Artículos y entrevistas sobre inglés, internacionalización y empleabilidad. Archivo del blog de Academia Georgetown. No es un tablón de noticias.',
  },
  '/career/': {
    title: 'Trabaja con nosotros - Academia Georgetown',
    description:
      'Únete al equipo de Academia Georgetown en Pamplona. Envía tu candidatura a través del formulario o escribe a info@academiageorgetown.es.',
  },
  '/referidos/': {
    title: 'Programa de referidos - Academia Georgetown',
    description:
      'Programa de referidos de Academia Georgetown. Si conoces a alguien que quiera certificar su inglés en Pamplona, escríbenos.',
  },
  '/formulario-subvencionados/': {
    title: 'Cursos subvencionados - Academia Georgetown',
    description:
      'Información histórica de convocatorias subvencionadas. Para la oferta actual, contacta con Academia Georgetown al 948 17 51 48.',
  },
  '/terminos/': {
    title: 'Términos y condiciones - Academia Georgetown',
    description: 'Términos y condiciones de contratación de YES ENGLISH SL, Academia Georgetown en Pamplona.',
  },
  '/politica-privacidad/': {
    title: 'Política de privacidad - Academia Georgetown',
    description: 'Política de privacidad y cookies de Academia Georgetown (YES ENGLISH SL).',
  },
  '/aviso-legal/': {
    title: 'Aviso legal - Academia Georgetown',
    description: 'Aviso legal de YES ENGLISH SL, Academia Georgetown. CIF B31705429. Pamplona.',
  },
};

export const noindexPaths = new Set<string>([
  '/404/',
  '/formulario-subvencionados/',
  ...pec.map((program) => `/${program.slug}/`),
]);

export function normalizeSeoPath(pathname: string): string {
  let path = pathname || '/';
  if (path.endsWith('.html')) path = path.slice(0, -5) || '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path === '/404') return '/404/';
  if (!path.endsWith('/')) path += '/';
  return path;
}

export function seoFor(pathname: string): SeoEntry | undefined {
  return seoByPath[normalizeSeoPath(pathname)];
}

export function isNoindexPath(pathname: string): boolean {
  return noindexPaths.has(normalizeSeoPath(pathname));
}
