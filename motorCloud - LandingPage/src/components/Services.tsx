import { Wrench, Cog, Disc, Navigation, Zap, Wind } from 'lucide-react';
import { servicios } from '../data/enterpriseData';

const iconMap = {
  Wrench,
  Cog,
  Disc,
  Navigation,
  Zap,
  Wind,
};

export const Services = () => {
  return (
    <section id="servicios" className="py-20 bg-neutral-50" aria-labelledby="servicios-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="servicios-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales para el mantenimiento y reparación de tu vehículo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicios.map((servicio) => {
            const IconComponent = iconMap[servicio.icon as keyof typeof iconMap];
            return (
              <article
                key={servicio.id}
                className="bg-white rounded-xl p-6 md:p-8 hover:shadow-xl transition-all transform hover:-translate-y-2 border border-neutral-200"
              >
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-orange-100 rounded-xl">
                    <IconComponent className="h-8 w-8 text-orange-500" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-3">
                  {servicio.nombre}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {servicio.descripcion}
                </p>
                <button className="mt-6 text-orange-500 font-semibold hover:text-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1">
                  Más información →
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
