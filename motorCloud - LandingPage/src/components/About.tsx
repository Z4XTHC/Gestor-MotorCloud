import { CheckCircle } from 'lucide-react';
import { enterpriseData, equipo } from '../data/enterpriseData';

export const About = () => {
  const valores = [
    'Honestidad y transparencia en todos nuestros presupuestos',
    'Equipo de profesionales certificados y en constante capacitación',
    'Equipamiento de última generación para diagnóstico preciso',
    'Garantía de calidad en todos nuestros trabajos',
  ];

  return (
    <section id="acerca" className="py-20 bg-white" aria-labelledby="acerca-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div>
            <h2 id="acerca-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Sobre {enterpriseData.razon_social}
            </h2>
            <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
              Con más de {enterpriseData.años_experiencia} años de trayectoria en {enterpriseData.ciudad}, {enterpriseData.provincia},
              nos hemos consolidado como el taller mecánico de referencia en la región. Nuestra pasión por la
              excelencia y el compromiso con nuestros clientes nos impulsa cada día.
            </p>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Trabajamos con todas las marcas y modelos, ofreciendo soluciones personalizadas que se
              adaptan a las necesidades específicas de cada vehículo y cliente.
            </p>

            <div className="space-y-4">
              {valores.map((valor, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-neutral-700">{valor}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/4489743/pexels-photo-4489743.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Equipo profesional trabajando en taller mecánico"
              className="rounded-xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-xl shadow-xl">
              <div className="text-4xl font-bold mb-1">+{enterpriseData.años_experiencia}</div>
              <div className="text-sm font-medium">Años de Experiencia</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10 text-center">
            Nuestro Equipo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipo.map((miembro) => (
              <article
                key={miembro.id}
                className="text-center group"
              >
                <div className="mb-6 relative inline-block">
                  <img
                    src={miembro.avatar}
                    alt={`${miembro.nombre} - ${miembro.puesto}`}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-orange-100 group-hover:border-orange-500 transition-colors shadow-lg"
                  />
                </div>
                <h4 className="text-xl font-bold text-neutral-900 mb-2">
                  {miembro.nombre}
                </h4>
                <p className="text-orange-500 font-semibold mb-1">
                  {miembro.puesto}
                </p>
                <p className="text-neutral-600 text-sm">
                  {miembro.experiencia}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
