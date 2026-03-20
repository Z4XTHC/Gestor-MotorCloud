// Los datos de empresa (razón social, dirección, ciudad, provincia, etc.) deben obtenerse con useEmpresa.
// Aquí solo deben quedar datos estáticos o de ejemplo.
export const enterpriseData = {
  horarios: "Lunes a Viernes: 8:00 - 18:00 | Sábados: 8:00 - 13:00",
  años_experiencia: 12,
  reparaciones_totales: 1000,
  clientes_satisfechos: 850,
};

export const servicios = [
  {
    id: 1,
    nombre: "Mantenimiento Preventivo",
    descripcion: "Revisión completa y cambio de aceite, filtros y fluidos",
    icon: "Wrench",
  },
  {
    id: 2,
    nombre: "Reparación de Motor",
    descripcion: "Diagnóstico y reparación de motores diesel y gasolina",
    icon: "Cog",
  },
  {
    id: 3,
    nombre: "Sistema de Frenos",
    descripcion: "Revisión, reparación y cambio de pastillas y discos",
    icon: "Disc",
  },
  {
    id: 4,
    nombre: "Suspensión y Dirección",
    descripcion: "Alineación, balanceo y reparación de tren delantero",
    icon: "Navigation",
  },
  {
    id: 5,
    nombre: "Sistema Eléctrico",
    descripcion: "Diagnóstico y reparación de sistemas eléctricos",
    icon: "Zap",
  },
  {
    id: 6,
    nombre: "Aire Acondicionado",
    descripcion: "Carga de gas, reparación y mantenimiento de A/C",
    icon: "Wind",
  },
];

export const equipo = [
  {
    id: 1,
    nombre: "Alexander Sosa",
    puesto: "Jefe de Taller",
    experiencia: "15 años de experiencia",
    avatar: "https://mangosofts.netlify.app/public/favicon.png",
  },
  {
    id: 2,
    nombre: "Joaquin Sosa",
    puesto: "Técnico Mecánico",
    experiencia: "10 años de experiencia",
    avatar: "https://mangosofts.netlify.app/public/favicon.png",
  },
  {
    id: 3,
    nombre: "Perez Sosa",
    puesto: "Técnico Eléctrico",
    experiencia: "8 años de experiencia",
    avatar: "https://mangosofts.netlify.app/public/favicon.png",
  },
];

export const testimonios = [
  {
    id: 1,
    nombre: "María González",
    comentario:
      "Excelente servicio, muy profesionales y rápidos. Mi auto quedó como nuevo.",
    rating: 5,
    fecha: "Hace 2 semanas",
  },
  {
    id: 2,
    nombre: "Roberto Silva",
    comentario:
      "Honestidad y transparencia en el presupuesto. Muy recomendable.",
    rating: 5,
    fecha: "Hace 1 mes",
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    comentario:
      "Atención personalizada y trabajo de calidad. Volveré sin dudas.",
    rating: 5,
    fecha: "Hace 3 semanas",
  },
];

export const marcas = [
  {
    nombre: "Toyota",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Toyota_logo_%28Red%29.svg/960px-Toyota_logo_%28Red%29.svg.png",
  },
  {
    nombre: "Volkswagen",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/960px-Volkswagen_logo_2019.svg.png",
  },
  {
    nombre: "Ford",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo_flat.svg/1920px-Ford_logo_flat.svg.png",
  },
  {
    nombre: "Chevrolet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Chevrolet_simple_logo.svg/500px-Chevrolet_simple_logo.svg.png",
  },
  {
    nombre: "Fiat",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FIAT_logo_coloured.svg/500px-FIAT_logo_coloured.svg.png",
  },
  {
    nombre: "Renault",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Renault_2021_Text.svg/500px-Renault_2021_Text.svg.png",
  },
];
