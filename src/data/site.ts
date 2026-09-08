export const site = {
  name: 'Academia Georgetown',
  legalName: 'YES ENGLISH SL',
  cif: 'B31705429',
  url: 'https://www.academiageorgetown.com',
  description:
    'Tu academia de Inglés en Pamplona. Centro Preparador y Examinador de Certificados de Inglés en Pamplona: Cambridge, TOEFL, British Council.',
  phone: '948 17 51 48',
  phoneHref: 'tel:+34948175148',
  phoneAlt: '637 81 21 63',
  email: 'info@academiageorgetown.es',
  address: 'C/ Iturrama 8, entreplanta B, 31007 Pamplona (Navarra)',
  tesla: 'https://georgetowntesla.com/home',
  recaptchaSiteKey: '6LdkAjQcAAAAACkQdK9O5RzVo8kMLnRgHUOwgiAv',
  gtmId: 'GTM-WTCZCMFB',
  gaId: 'G-YVMK3K4W8M',
  adsId: 'AW-1002664104',
};

export const nav = [
  { href: '/ingles-para-estudiantes/', label: 'Universitarios' },
  { href: '/ingles-profesional/', label: 'Profesional' },
  { href: '/ingles-para-jovenes/', label: 'Jóvenes' },
  { href: '/contacto/', label: 'Contacto' },
];

type FooterLink = { href: string; label: string; external?: boolean };

export const footerCols: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Enlaces',
    links: [
      { href: '/', label: 'Inicio' },
      { href: '/ingles-para-estudiantes/', label: 'Académico' },
      { href: '/ingles-profesional/', label: 'Profesional' },
      { href: '/ingles-para-jovenes/', label: 'Jóvenes' },
      { href: site.tesla, label: 'Georgetown TESLA', external: true },
    ],
  },
  {
    title: 'Contactar',
    links: [
      { href: '/contacto/', label: 'Contacto' },
      { href: '/career/', label: 'Trabaja con Nosotros' },
    ],
  },
  {
    title: 'Responsabilidad',
    links: [
      { href: '/terminos/', label: 'Términos y Condiciones' },
      { href: '/politica-privacidad/', label: 'Política de Privacidad' },
      { href: '/aviso-legal/', label: 'Aviso Legal' },
    ],
  },
];

export const footerLinks = {
  enlaces: footerCols[0].links,
  contactar: [...footerCols[1].links, ...footerCols[2].links],
};

export const faqs = [
  {
    q: '¿Por qué la Academia de Inglés Georgetown?',
    a: 'La Academia de Inglés Georgetown ofrece un aprendizaje completo e innovador del inglés que cuenta con más de 20 años de experiencia e investigación. Ofrecemos un método que garantiza alcanzar los objetivos que deseas en el menor tiempo posible gracias a la atención personalizada del profesorado.',
  },
  {
    q: '¿En qué consiste el método Georgetown?',
    a: 'Desde el primer momento el profesorado, altamente cualificado, evalúa tu conocimiento y habilidades del inglés para diseñar un plan de seguimiento basado en reforzar las áreas que necesites y mejorar tu nivel. Además, cuenta con una herramienta única, ALTEA Labs (Advanced Learning Technologies & Electronic Assessment), diseñada para cumplir tus objetivos ahorrando tiempo y esfuerzo.',
  },
  {
    q: '¿Qué tipos de cursos hay?',
    a: 'Hay una gran variedad de cursos, todos adaptados a tus necesidades. Ofrecemos cursos trimestrales, semestrales y anuales. Además, hay intensivos de verano de 4, 3 o 2 horas semanales.',
  },
  {
    q: '¿Qué programas disponibles hay?',
    a: 'Ofrecemos cursos en modalidad presencial, online o combinando ambas. Clases particulares según horario o clases grupales de 9 personas como máximo.',
  },
  {
    q: '¿Qué pasa si no sé mi nivel de Inglés?',
    a: 'Antes de comenzar, realizarás una prueba de nivel para evaluar tu inglés y adaptar el programa a tus necesidades.',
  },
  {
    q: '¿Dónde está la Academia de Inglés Georgetown?',
    a: 'Está ubicada en Iturrama 8, entreplanta B, Pamplona, entre la Universidad de Navarra y la Universidad Pública de Navarra. También se imparten clases online y por videoconferencia.',
  },
  {
    q: '¿Dónde se realizan los exámenes?',
    a: 'La Academia de Inglés Georgetown es centro examinador de los certificados de TOEFL iBT® y APTIS.',
  },
];

export const mission = [
  {
    title: 'Excelencia',
    text: 'En la Academia de Inglés Georgetown creemos que la búsqueda de la excelencia es el único camino. Somos exigentes con el trabajo, pero los resultados siempre compensan el esfuerzo.',
  },
  {
    title: 'Innovación',
    text: 'Investigamos de manera incansable para innovar; desarrollamos herramientas únicas para que el alumno rentabilice su esfuerzo y tiempo.',
  },
  {
    title: 'Resultados',
    text: 'Aunque no sea indispensable, desde la Academia de Inglés Georgetown, animamos a todos nuestros alumnos a plasmar su esfuerzo y progresos en algo tangible: el examen oficial.',
  },
  {
    title: 'El Tiempo es Oro',
    text: 'Necesitas estudiar y/o trabajar en Inglés en menos de un año. Aunque empezar pronto facilita la labor y garantiza mejores resultados, la Academia de Inglés Georgetown es especialista en el desafío del corto plazo.',
  },
  {
    title: 'Cada Alumno es Único',
    text: 'En la Academia de Inglés Georgetown sabemos que no hay dos alumnos iguales. Las necesidades del alumno son la única directriz. El programa se personaliza en función del nivel y objetivos de cada uno.',
  },
  {
    title: 'Misión',
    text: 'Nuestra misión es enseñar a cada alumno a trabajar de la manera más eficiente para alcanzar sus metas en el mínimo tiempo. Sin eficiencia no hay excelencia.',
  },
];

export const pillars = [
  {
    title: 'Método',
    text: 'La Academia de Inglés Georgetown ha desarrollado un método de aprendizaje avanzado que optimiza el tiempo y esfuerzo invertido alcanzando las más altas cotas del dominio del inglés.',
  },
  {
    title: 'Tutoría Especializada',
    text: 'Acciones formativas con Tutela asíncrona o tuteladas con Profesores certificados: Las actividades formativas son tutorizadas por personal docente certificado por la Academia de Inglés Georgetown.',
  },
  {
    title: 'Ámbito Y Calendario',
    text: 'Configuramos la acción formativa (12-24-36 semanas) y el calendario de Formación con fechas de pruebas de progreso y Examen Final.',
  },
  {
    title: 'Online',
    text: 'Gracias a la plataforma propia de la Academia de Inglés Georgetown los cursos se pueden impartir tanto de manera presencial en Pamplona como de manera Online, ajustándose a las necesidades de cada alumno.',
  },
];

export const seoLandings = [
  {
    slug: 'curso-de-ingles-en-pamplona',
    title: 'Curso de inglés en Pamplona',
    h1: 'Curso de inglés en Pamplona',
  },
  {
    slug: 'academia-de-ingles-en-pamplona',
    title: 'Academia de inglés en Pamplona',
    h1: 'Academia de inglés en Pamplona',
  },
  {
    slug: 'sacarse-el-b1-de-ingles-en-pamplona',
    title: 'Sacarse el B1 de inglés en Pamplona',
    h1: 'Sacarse el B1 de inglés en Pamplona',
  },
  {
    slug: 'sacarse-el-b2-de-ingles-en-pamplona',
    title: 'Sacarse el B2 de inglés en Pamplona',
    h1: 'Sacarse el B2 de inglés en Pamplona',
  },
  {
    slug: 'sacarse-el-c1-de-ingles-en-pamplona',
    title: 'Sacarse el C1 de inglés en Pamplona',
    h1: 'Sacarse el C1 de inglés en Pamplona',
  },
  {
    slug: 'certificado-de-ingles-en-pamplona',
    title: 'Certificado de inglés en Pamplona',
    h1: 'Certificado de inglés en Pamplona',
  },
];
