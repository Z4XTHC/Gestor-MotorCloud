import { Star, Quote } from 'lucide-react';
import { testimonios } from '../data/enterpriseData';

export const Testimonials = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-orange-500 fill-orange-500' : 'text-neutral-300'
        }`}
        aria-hidden="true"
      />
    ));
  };

  return (
    <section className="py-20 bg-white" aria-labelledby="testimonios-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="testimonios-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((testimonio) => (
            <article
              key={testimonio.id}
              className="bg-neutral-50 rounded-xl p-6 md:p-8 relative hover:shadow-xl transition-all transform hover:-translate-y-2"
            >
              <div className="mb-4">
                <Quote className="h-10 w-10 text-orange-500 opacity-20" aria-hidden="true" />
              </div>

              <div className="flex gap-1 mb-4" role="img" aria-label={`${testimonio.rating} de 5 estrellas`}>
                {renderStars(testimonio.rating)}
              </div>

              <p className="text-neutral-700 mb-6 leading-relaxed italic">
                "{testimonio.comentario}"
              </p>

              <div className="border-t border-neutral-200 pt-4">
                <div className="font-bold text-neutral-900">{testimonio.nombre}</div>
                <div className="text-sm text-neutral-500">{testimonio.fecha}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
