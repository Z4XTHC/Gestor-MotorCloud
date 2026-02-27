import { Edit } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Cliente } from "../../types";
import DetallesModal from "../../components/common/DetallesModal";
import { useState, useEffect } from "react";
import categoriaAfipApi from "../../api/categoriaAfipApi";
import paisApi from "../../api/paisApi";

interface ClientesDetallesProps {
  cliente: Cliente | null;
  onClose: () => void;
  onEdit?: (cliente: Cliente) => void;
}

export const ClientesDetalles = ({
  cliente,
  onClose,
  onEdit,
}: ClientesDetallesProps) => {
  const [categoriasAfip, setCategoriasAfip] = useState<any[]>([]);
  const [paises, setPaises] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasData, paisesData] = await Promise.all([
          categoriaAfipApi.obtenerCategoriasAfip(),
          paisApi.obtenerPaises(),
        ]);
        setCategoriasAfip(categoriasData);
        setPaises(
          Array.isArray(paisesData) ? paisesData : paisesData.data || [],
        );
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    fetchData();
  }, []);

  if (!cliente) return null;

  // Helper para obtener el nombre de la categoría AFIP
  const getCategoriaAfipNombre = () => {
    if (cliente.categoriaAfip?.nombre) {
      return cliente.categoriaAfip.nombre;
    }
    const categoriaId = (cliente as any).categoriaAfip_id;
    if (categoriaId) {
      const categoria = categoriasAfip.find(
        (c) => c._id === categoriaId || c.id === categoriaId,
      );
      return categoria?.nombre || "-";
    }
    return "-";
  };

  // Helper para obtener el nombre del país
  const getPaisNombre = () => {
    if (typeof cliente.pais === "string") {
      // Si pais es un string simple, podría ser el nombre o el ID
      const paisById = paises.find(
        (p) => p._id === cliente.pais || p.id === cliente.pais,
      );
      if (paisById) {
        return paisById.nombre;
      }
      return cliente.pais; // Es el nombre directamente
    }
    if ((cliente.pais as any)?.nombre) {
      return (cliente.pais as any).nombre;
    }
    const paisId = (cliente as any).pais_id;
    if (paisId) {
      const pais = paises.find((p) => p._id === paisId || p.id === paisId);
      return pais?.nombre || "-";
    }
    return "-";
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cerrar
      </Button>
      {onEdit && (
        <Button
          icon={<Edit className="w-4 h-4" />}
          onClick={() => onEdit(cliente)}
        >
          Editar
        </Button>
      )}
    </>
  );
  const headerContent = (
    <div className="flex items-center gap-4">
      {cliente.image || cliente.linktofile ? (
        <img
          src={cliente.image || cliente.linktofile}
          alt={cliente.nombreFantasia}
          className="w-12 h-12 object-contain rounded-lg"
        />
      ) : (
        <div className="w-12 h-12 bg-primary-lighter dark:bg-dark-bg rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-primary dark:text-dark-primary">
            {cliente.nombreFantasia?.charAt(0)}
          </span>
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
          {cliente.nombreFantasia}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {cliente.razonSocial}
        </p>
      </div>
    </div>
  );

  return (
    <DetallesModal
      headerContent={headerContent}
      onClose={onClose}
      footer={footer}
      maxWidthClass="max-w-2xl"
      contentClassName="p-6"
    >
      <div className="space-y-6">
        {/* Información Básica */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            Información Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Nombre de Fantasía
              </label>
              <p className="text-gray-900 dark:text-dark-text">
                {cliente.nombreFantasia}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Razón Social
              </label>
              <p className="text-gray-900 dark:text-dark-text">
                {cliente.razonSocial}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                CUIT
              </label>
              <p className="text-gray-900 dark:text-dark-text">
                {cliente.cuit}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Rubro
              </label>
              <p className="text-gray-900 dark:text-dark-text">
                {cliente.rubro?.nombre || "-"}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Categoría AFIP
              </label>
              <p className="text-gray-900 dark:text-dark-text">
                {getCategoriaAfipNombre()}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Estado
              </label>
              <p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    cliente.status?.toLowerCase().includes("activado")
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {cliente.status || "Sin estado"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Email
              </label>
              <p className="text-gray-900 dark:text-dark-text break-all">
                {cliente.email || "-"}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Teléfono
              </label>
              <p className="text-gray-900 dark:text-dark-text">
                {cliente.telefono || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Información de Ubicación */}
        {(cliente.direccion ||
          cliente.ciudad ||
          cliente.provincia ||
          cliente.pais) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cliente.direccion && (
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Dirección
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {cliente.direccion}
                  </p>
                </div>
              )}

              {cliente.ciudad && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Ciudad
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {typeof cliente.ciudad === "string"
                      ? cliente.ciudad
                      : (cliente.ciudad as any)?.nombre || "-"}
                  </p>
                </div>
              )}

              {cliente.provincia && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Provincia
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {typeof cliente.provincia === "string"
                      ? cliente.provincia
                      : (cliente.provincia as any)?.nombre || "-"}
                  </p>
                </div>
              )}

              {cliente.pais && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    País
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {getPaisNombre()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información de Registro */}
        {(cliente.createdAt || cliente.updatedAt) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              Registro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cliente.createdAt && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Fecha de Alta
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {new Date(cliente.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}

              {cliente.updatedAt && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Última Actualización
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {new Date(cliente.updatedAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DetallesModal>
  );
};
