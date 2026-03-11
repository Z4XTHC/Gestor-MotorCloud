import { useState } from 'react';
import { Search } from 'lucide-react';
import { enterpriseData } from '../data/enterpriseData';

export const Hero = () => {
  const [ordenNumero, setOrdenNumero] = useState('');

  const handleConsulta = (e: React.FormEvent) => {
    e.preventDefault();
    if (ordenNumero.trim()) {
      alert(`Consultando orden: ${ordenNumero}`);
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20"
      role="banner"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Taller mecánico profesional"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-900/80 to-orange-900/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Servicio Técnico de <br />
          <span className="text-orange-500">Excelencia</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-neutral-100 mb-12 max-w-3xl mx-auto">
          {enterpriseData.años_experiencia} años brindando soluciones profesionales para tu vehículo en {enterpriseData.ciudad}, {enterpriseData.provincia}
        </p>

        <form onSubmit={handleConsulta} className="max-w-2xl mx-auto mb-8">
          <label htmlFor="orden-numero" className="sr-only">
            Número de orden de trabajo
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400"
                aria-hidden="true"
              />
              <input
                id="orden-numero"
                type="text"
                value={ordenNumero}
                onChange={(e) => setOrdenNumero(e.target.value)}
                placeholder="Ingresá tu número de OT"
                className="w-full pl-12 pr-4 py-4 rounded-lg text-lg border-2 border-transparent focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Número de orden de trabajo"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Consultar Estado
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#presupuesto"
            className="px-6 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-50 transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 shadow-lg"
          >
            Solicitar Presupuesto
          </a>
          <a
            href={`https://wa.me/${enterpriseData.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-neutral-900 transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
};
