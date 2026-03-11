import { useState, useEffect } from 'react';
import { Menu, X, Wrench } from 'lucide-react';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { enterpriseData } from '../data/enterpriseData';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Servicios', id: 'servicios' },
    { name: 'Acerca de', id: 'acerca' },
    { name: 'Presupuesto', id: 'presupuesto' },
    { name: 'Contacto', id: 'contacto' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollDirection === 'down' && isScrolled ? '-translate-y-full' : 'translate-y-0'
      } ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg p-2 -ml-2"
            aria-label={`Ir a inicio - ${enterpriseData.razon_social}`}
          >
            <Wrench className="h-8 w-8 text-orange-500" aria-hidden="true" />
            <span className="text-xl md:text-2xl font-bold text-neutral-900">
              {enterpriseData.razon_social}
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-2 text-neutral-900 hover:text-orange-500 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('hero')}
              className="ml-4 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-md"
              aria-label="Seguimiento de orden de trabajo"
            >
              Seguimiento de Orden
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-neutral-900" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6 text-neutral-900" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200" role="menu">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-4 py-3 text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                role="menuitem"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('hero')}
              className="block w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-center focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md mt-4"
              role="menuitem"
            >
              Seguimiento de Orden
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
