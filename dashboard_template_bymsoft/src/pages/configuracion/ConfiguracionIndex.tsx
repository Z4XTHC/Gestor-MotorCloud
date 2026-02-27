import { Card } from "../../components/common/Card";
import { Settings, MapPin, Briefcase, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const ConfiguracionIndex = () => {
  const configSections = [
    {
      title: "Ubicaciones",
      description: "Gestionar países, provincias y localidades",
      icon: <MapPin className="w-8 h-8" />,
      path: "/localidades",
      color: "bg-primary",
    },
    {
      title: "Rubros",
      description: "Categorías de negocios y rubros",
      icon: <Briefcase className="w-8 h-8" />,
      path: "/rubros",
      color: "bg-primary-dark",
    },
    {
      title: "Tipos de Orden",
      description: "Tipos de órdenes de servicio",
      icon: <FileText className="w-8 h-8" />,
      path: "/tipos-ordenes",
      color: "bg-primary",
    },
    {
      title: "Técnicos",
      description: "Gestión de técnicos asignados",
      icon: <Users className="w-8 h-8" />,
      path: "/tecnicos",
      color: "bg-primary",
    },
    {
      title: "Interfaz",
      description: "Configuración de Interfaz de Usuario",
      icon: <Settings className="w-8 h-8" />,
      path: "/interfaz",
      color: "bg-primary",
    },
    {
      title: "Logo",
      description: "Configuración del Logo del Sistema",
      icon: <Settings className="w-8 h-8" />,
      path: "/logo",
      color: "bg-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
          Configuración del Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Parámetros y configuraciones generales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configSections.map((section, index) => (
          <Link key={index} to={section.path}>
            <Card className="hover:shadow-primary-lg transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className={`${section.color} p-3 rounded-lg text-white`}>
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {section.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
