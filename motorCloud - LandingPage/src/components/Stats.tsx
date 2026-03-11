import { Award, Users, Wrench, Clock } from 'lucide-react';
import { enterpriseData } from '../data/enterpriseData';

export const Stats = () => {
  const stats = [
    {
      icon: Wrench,
      value: `+${enterpriseData.reparaciones_totales}`,
      label: 'Reparaciones Exitosas',
      color: 'text-orange-500',
    },
    {
      icon: Clock,
      value: `${enterpriseData.años_experiencia}`,
      label: 'Años de Experiencia',
      color: 'text-orange-500',
    },
    {
      icon: Users,
      value: `+${enterpriseData.clientes_satisfechos}`,
      label: 'Clientes Satisfechos',
      color: 'text-orange-500',
    },
    {
      icon: Award,
      value: '100%',
      label: 'Garantía de Calidad',
      color: 'text-orange-500',
    },
  ];

  return (
    <section className="py-16 bg-white" aria-labelledby="stats-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="stats-title" className="sr-only">
          Estadísticas de {enterpriseData.razon_social}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-neutral-50 rounded-xl p-6 md:p-8 text-center hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <IconComponent
                      className={`h-8 w-8 ${stat.color}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-neutral-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
