import { Wrench, Facebook, Instagram, Twitter } from 'lucide-react';
import { enterpriseData } from '../data/enterpriseData';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Servicios', id: 'servicios' },
    { name: 'Acerca de', id: 'acerca' },
    { name: 'Presupuesto', id: 'presupuesto' },
    { name: 'Contacto', id: 'contacto' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#' },
    { name: 'Instagram', icon: Instagram, url: '#' },
    { name: 'Twitter', icon: Twitter, url: '#' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <footer className="bg-neutral-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Wrench className="h-8 w-8 text-orange-500" aria-hidden="true" />
              <span className="text-2xl font-bold">{enterpriseData.razon_social}</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Servicio técnico de excelencia con más de {enterpriseData.años_experiencia} años de experiencia
              en {enterpriseData.ciudad}, {enterpriseData.provincia}.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-neutral-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a
                  href={`tel:${enterpriseData.telefono}`}
                  className="hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                >
                  {enterpriseData.telefono}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${enterpriseData.email}`}
                  className="hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                >
                  {enterpriseData.email}
                </a>
              </li>
              <li>{enterpriseData.direccion}</li>
              <li>
                {enterpriseData.ciudad}, {enterpriseData.provincia}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Horarios</h3>
            <p className="text-neutral-400">{enterpriseData.horarios}</p>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              © {currentYear} {enterpriseData.razon_social}. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="text-neutral-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded">
                Política de Privacidad
              </button>
              <button className="text-neutral-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded">
                Términos y Condiciones
              </button>
            </div>
          </div>
          <p className="text-neutral-500 text-xs mt-4 text-center md:text-left">
            CUIT: {enterpriseData.datos_fiscal}
          </p>
        </div>
      </div>
    </footer>
  );
};
