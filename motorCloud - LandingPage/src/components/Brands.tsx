import { marcas } from '../data/enterpriseData';

export const Brands = () => {
  return (
    <section className="py-16 bg-neutral-50" aria-labelledby="marcas-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="marcas-title" className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10 text-center">
          Trabajamos con todas las marcas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {marcas.map((marca, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 group"
            >
              <img
                src={marca.logo}
                alt={`Logo de ${marca.nombre}`}
                className="w-full h-20 object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
