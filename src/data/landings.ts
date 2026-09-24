export const benefitPoints = [
  'Prepara y certifica tu nivel de inglés con tu centro examinador en Pamplona de TOEFL iBT®, y APTIS en colaboración con el British Council.',
  'Los Cursos de inglés Georgetown te capacitan de manera eficiente y personalizada gracias a la plataforma Georgetown ALTEA y nuestro profesorado experto.',
  'El objetivo es prepararte en el menor tiempo posible para certificar tu nivel de inglés y así destacar en tu entorno académico.',
  'Aumenta tus opciones de éxito en tu trayectoria académica y profesional; alcanza tus objetivos académicos y multiplica las oportunidades de estudiar o trabajar en el extranjero.',
  'El método Georgetown ha sido desarrollado por un grupo de expertos lingüistas con el objetivo de ofrecer el programa más completo de enseñanza del inglés.',
  'Cada día es mayor el número de empresas que consideran indispensable las certificaciones de inglés en el mercado laboral.',
];

export const jovenesPoints = [
  benefitPoints[0],
  'Los Cursos de inglés Georgetown te capacitan de manera eficiente y personalizada gracias a la plataforma ALTEA Labs y nuestro profesorado experto.',
  benefitPoints[2],
  benefitPoints[3],
  benefitPoints[4],
  benefitPoints[5],
];

export const profesionalPoints = [
  benefitPoints[0],
  benefitPoints[1],
  'Prepárate en el menor tiempo posible para certificar tu nivel de inglés y así destacar en tu entorno profesional.',
  benefitPoints[3],
  benefitPoints[4],
  benefitPoints[5],
];

export const profesionalPillars = [
  {
    title: 'Método',
    text: 'Georgetown ha desarrollado un método de aprendizaje avanzado por el cual optimizar el tiempo y esfuerzo invertido en la preparacion de los certificados de inglés.',
  },
  {
    title: 'Tutoría Especializada',
    text: 'Los Cursos de inglés Georgetown te capacitan de manera eficiente y personalizada gracias a la plataforma Georgetown ALTEA y nuestro profesorado experto en la enseñanza del inglés.',
  },
  {
    title: 'Ámbito Y Calendario',
    text: 'Configuramos la acción formativa (12-24-36 semanas) y el calendario de Formación adaptado a tu nivel y a la fecha del examen',
  },
  {
    title: 'Online',
    text: 'Gracias a la plataforma propia de la Academia Georgetown los cursos se pueden impartir tanto de manera presencial en Pamplona como de manera Online, ajustándose a las necesidades de cada alumno.',
  },
];

export const profesionalFaqs = [
  {
    q: '¿Por qué una didáctica específica?',
    a: '«Ha llegado la hora de dejar de perder tiempo, dinero y esfuerzo en aprender Inglés en un contexto de banalidades que nada tienen que ver con el Producto y Servicios que Usted produce u ofrece”. El acceso a un mercado de trabajo internacional es clave para tener éxito, por eso los cursos de inglés técnico de especialidad garantizan que ningún miembro de su equipo pierda ni un minuto en aprender algo que no le hace falta ni le ayuda en el desempeño óptimo de sus funciones.',
  },
  {
    q: '¿Quién desarrolla los contenidos?',
    a: 'Nuestro equipo Internacional de Lingüistas, expertos en didáctica y asesores experimentados diseñarán los contenidos más específicos y característicos dentro de su área de investigación y estudio.',
  },
  {
    q: '¿Se ajusta a mis necesidades?',
    a: 'Si usted quiere aprender lo que verdaderamente encuentran útil o necesita para el desempeño óptimo de sus funciones, solo un programa de inglés técnico diseñado a medida les ayudará a hacerlo en el mínimo tiempo y con la mayor precisión.',
  },
  {
    q: '¿Qué incluye un programa de inglés técnico diseñado a medida?',
    a: 'El mayor banco de Vocabulario, terminología y conceptos de lenguaje y jerga particular del dominio de conocimiento técnico-científico característico de la Actividad de su área profesional. Así como una plataforma de gramática desarrollada, con dicho lenguaje como contexto, para depurar de errores de Comunicación oral o escrita de quienes representan su servicio.',
  },
  {
    q: '¿Es difícil o complicado?',
    a: 'Solamente tiene que solicitarlo, y un experto de nuestra organización se pondrá en contacto con Usted para analizar sus necesidades y especificar con exactitud los requisitos para el Producto o Servicio que solicite de nosotros. A partir de ahí, Nuestro personal Experto en desarrollo de Contenidos, Didácticas y Pruebas de Evaluación es capaz de ejecutar su proyecto, por exigente que sea el desafío.',
  },
  {
    q: '¿Cuánto tiempo tarda una didáctica específica en ser operativa?',
    a: 'Georgetown garantiza la presentación de una primera versión 100% operativa en 21 días o menos, después de la firma del compromiso. 6 días, a partir de la aceptación de la versión Inicial Operativa, es el plazo habitual antes del inicio del primer curso.',
  },
];

/** Shared visible landing copy. Unique intent copy lives in titles, meta, and JSON-LD. */
export const VISIBLE_LANDING_INTRO =
  'La Academia Georgetown es tu centro especializado para aprender inglés en Pamplona. Ofrecemos programas personalizados y eficientes que te permitirán dominar el idioma en el menor tiempo posible. Con la plataforma Georgetown ALTEA y nuestro equipo de expertos lingüistas, garantizamos una formación de excelencia adaptada a tus necesidades. Prepárate para los certificados Cambridge, TOEFL iBT®, APTIS e IELTS.';

const localServiceLinks = [
  { href: '/academia-de-ingles-en-pamplona/', label: 'Academia de inglés en Pamplona' },
  { href: '/sacarse-el-b1-de-ingles-en-pamplona/', label: 'Sacarse el B1 de inglés en Pamplona' },
  { href: '/sacarse-el-b2-de-ingles-en-pamplona/', label: 'Sacarse el B2 de inglés en Pamplona' },
  { href: '/sacarse-el-c1-de-ingles-en-pamplona/', label: 'Sacarse el C1 de inglés en Pamplona' },
  { href: '/certificado-de-ingles-en-pamplona/', label: 'Certificado de inglés en Pamplona' },
  { href: '/ingles-para-jovenes/', label: 'Clases de inglés para jóvenes en Pamplona' },
];

export const seoBodies: Record<string, { intro: string; links: { href: string; label: string }[] }> = {
  'academia-de-ingles-en-pamplona': {
    intro:
      'Academia Georgetown es una academia de inglés en Pamplona, en Iturrama 8, entre la Universidad de Navarra y la UPNA. Damos clase presencial, online o combinando ambas, con grupos de 9 alumnos como máximo. El método Georgetown y ALTEA Labs organizan el trabajo para que cada alumno avance según su nivel y su objetivo.',
    links: localServiceLinks,
  },
  'curso-de-ingles-en-pamplona': {
    intro:
      'Un curso de inglés en Pamplona en Georgetown se arma a tu medida: prueba de nivel, calendario de 12, 24 o 36 semanas y seguimiento del profesorado. Puedes venir a Iturrama o seguir online. El objetivo es rentabilizar el tiempo de estudio, no repetir un temario genérico.',
    links: localServiceLinks,
  },
  'certificado-de-ingles-en-pamplona': {
    intro:
      'Si buscas un certificado de inglés en Pamplona, primero fijamos el nivel y el título que necesitas. Georgetown prepara Cambridge, TOEFL iBT® y APTIS, y es centro examinador de TOEFL iBT® y APTIS. La convocatoria y la inscripción se gestionan contigo en la academia, no desde un enlace externo.',
    links: localServiceLinks,
  },
  'sacarse-el-b1-de-ingles-en-pamplona': {
    intro:
      'Sacarse el B1 de inglés en Pamplona empieza por saber si ese es tu nivel real. Tras la prueba de nivel, Georgetown diseña un plan para el B1 Preliminary: vocabulario, comprensión y expresión, con tutoría cercana. Cuando el B1 está sólido, el siguiente paso natural es el B2.',
    links: localServiceLinks,
  },
  'sacarse-el-b2-de-ingles-en-pamplona': {
    intro:
      'Sacarse el B2 de inglés en Pamplona es el objetivo más pedido entre universitarios y profesionales. En Georgetown preparamos el B2 First con evaluación inicial, ALTEA Labs y control periódico del progreso. El programa se acorta o se alarga según lo que te falte, no según un calendario cerrado.',
    links: localServiceLinks,
  },
  'sacarse-el-c1-de-ingles-en-pamplona': {
    intro:
      'Sacarse el C1 de inglés en Pamplona pide precisión académica y profesional. Georgetown prepara el C1 Advanced con un plan personalizado: reforzar las destrezas débiles y practicar el registro que pide el examen. Presencial u online, siempre con profesorado experto y grupos reducidos.',
    links: localServiceLinks,
  },
};
