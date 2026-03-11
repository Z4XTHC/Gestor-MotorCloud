import { useState } from 'react';
import { Send } from 'lucide-react';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  marca: string;
  modelo: string;
  año: string;
  servicio: string;
  mensaje: string;
}

interface FormErrors {
  [key: string]: string;
}

export const QuoteForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    telefono: '',
    marca: '',
    modelo: '',
    año: '',
    servicio: '',
    mensaje: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.servicio) {
      newErrors.servicio = 'Seleccione un servicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      alert('Presupuesto enviado con éxito. Nos contactaremos a la brevedad.');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        marca: '',
        modelo: '',
        año: '',
        servicio: '',
        mensaje: '',
      });
      setErrors({});
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="presupuesto" className="py-20 bg-neutral-50" aria-labelledby="presupuesto-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="presupuesto-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Solicitá tu Presupuesto
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            Completá el formulario y te responderemos en menos de 24 horas
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 md:p-10"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold text-neutral-700 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.nombre ? 'border-red-500' : 'border-neutral-300'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                aria-required="true"
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'nombre-error' : undefined}
              />
              {errors.nombre && (
                <p id="nombre-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-neutral-300'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-semibold text-neutral-700 mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.telefono ? 'border-red-500' : 'border-neutral-300'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                aria-required="true"
                aria-invalid={!!errors.telefono}
                aria-describedby={errors.telefono ? 'telefono-error' : undefined}
              />
              {errors.telefono && (
                <p id="telefono-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.telefono}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="servicio" className="block text-sm font-semibold text-neutral-700 mb-2">
                Servicio <span className="text-red-500">*</span>
              </label>
              <select
                id="servicio"
                name="servicio"
                value={formData.servicio}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.servicio ? 'border-red-500' : 'border-neutral-300'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                aria-required="true"
                aria-invalid={!!errors.servicio}
                aria-describedby={errors.servicio ? 'servicio-error' : undefined}
              >
                <option value="">Seleccione un servicio</option>
                <option value="mantenimiento">Mantenimiento Preventivo</option>
                <option value="motor">Reparación de Motor</option>
                <option value="frenos">Sistema de Frenos</option>
                <option value="suspension">Suspensión y Dirección</option>
                <option value="electrico">Sistema Eléctrico</option>
                <option value="aire">Aire Acondicionado</option>
                <option value="otro">Otro</option>
              </select>
              {errors.servicio && (
                <p id="servicio-error" className="text-red-500 text-sm mt-1" role="alert">
                  {errors.servicio}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="marca" className="block text-sm font-semibold text-neutral-700 mb-2">
                Marca del Vehículo
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="modelo" className="block text-sm font-semibold text-neutral-700 mb-2">
                Modelo
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="año" className="block text-sm font-semibold text-neutral-700 mb-2">
                Año
              </label>
              <input
                type="text"
                id="año"
                name="año"
                value={formData.año}
                onChange={handleChange}
                placeholder="Ej: 2020"
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="mensaje" className="block text-sm font-semibold text-neutral-700 mb-2">
              Mensaje Adicional
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              rows={4}
              placeholder="Contanos qué problema tenés con tu vehículo..."
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 transition-all font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              'Enviando...'
            ) : (
              <>
                <Send className="h-5 w-5" aria-hidden="true" />
                Enviar Solicitud
              </>
            )}
          </button>

          <p className="text-sm text-neutral-500 text-center mt-4">
            Los campos marcados con <span className="text-red-500">*</span> son obligatorios
          </p>
        </form>
      </div>
    </section>
  );
};
