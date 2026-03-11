import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { enterpriseData } from "../data/enterpriseData";

export const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      label: "Dirección",
      value: `${enterpriseData.direccion}, ${enterpriseData.ciudad}, ${enterpriseData.provincia}`,
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${enterpriseData.direccion}, ${enterpriseData.ciudad}, ${enterpriseData.provincia}`,
      )}`,
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: enterpriseData.telefono,
      link: `tel:${enterpriseData.telefono}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: enterpriseData.email,
      link: `mailto:${enterpriseData.email}`,
    },
    {
      icon: Clock,
      label: "Horarios",
      value: enterpriseData.horarios,
    },
  ];

  return (
    <section
      id="contacto"
      className="py-20 bg-white"
      aria-labelledby="contacto-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="contacto-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4"
          >
            Visitanos o Contactanos
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            Estamos para ayudarte con lo que necesites
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-neutral-50 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Información de Contacto
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg flex-shrink-0">
                        <IconComponent
                          className="h-6 w-6 text-orange-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-500 mb-1">
                          {item.label}
                        </div>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-neutral-900 hover:text-orange-500 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                            target={item.icon === MapPin ? "_blank" : undefined}
                            rel={
                              item.icon === MapPin
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="text-neutral-900 font-medium">
                            {item.value}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-orange-500 text-white rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">
                ¿Tenés una emergencia?
              </h3>
              <p className="mb-6 opacity-90">
                Contactanos por WhatsApp para atención inmediata
              </p>
              <a
                href={`https://wa.me/${enterpriseData.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-orange-500 px-6 py-3 rounded-lg hover:bg-neutral-50 transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500 shadow-lg"
              >
                Enviar WhatsApp
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg h-[500px]">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d526.1081074822408!2d-58.95846251550169!3d-27.493552208786745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x944572da62dcee49%3A0x5a486a90b400a342!2sKiosco%2024%20hs%20JoaLuNahy%20-%20iTI%20Tienda%20Servicio%20T%C3%A9cnico!5e0!3m2!1ses!2sar!4v1773254411263!5m2!1ses!2sar`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Ubicación de ${enterpriseData.razon_social} en ${enterpriseData.ciudad}, ${enterpriseData.provincia}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
