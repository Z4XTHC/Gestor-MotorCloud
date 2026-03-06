import { Edit, User } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Usuario } from "../../types/usuario";
import DetallesModal from "../../components/common/DetallesModal";

interface UsuariosDetallesProps {
  usuario: Usuario | null;
  onClose: () => void;
  onEdit?: (usuario: Usuario) => void;
}

export const UsuariosDetalles = ({
  usuario,
  onClose,
  onEdit,
}: UsuariosDetallesProps) => {
  if (!usuario) return null;

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cerrar
      </Button>
      {onEdit && (
        <Button icon={<Edit className="w-4 h-4" />} onClick={() => onEdit(usuario)}>
          Editar
        </Button>
      )}
    </>
  );

  const headerContent = (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-primary-lighter dark:bg-dark-bg rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-primary dark:text-dark-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
          {usuario.nombre} {usuario.apellido}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">@{usuario.username}</p>
      </div>
    </div>
  );

  return (
    <DetallesModal
      headerContent={headerContent}
      onClose={onClose}
      footer={footer}
      maxWidthClass="max-w-lg"
      contentClassName="p-6"
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            Información del Usuario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">ID</label>
              <p className="text-gray-900 dark:text-dark-text">{usuario.id}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Usuario</label>
              <p className="text-gray-900 dark:text-dark-text">@{usuario.username}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Nombre</label>
              <p className="text-gray-900 dark:text-dark-text">{usuario.nombre}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Apellido</label>
              <p className="text-gray-900 dark:text-dark-text">{usuario.apellido}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Rol</label>
              <p>
                <span
                  className={
                    usuario.rol === "ADMIN"
                      ? "inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }
                >
                  {usuario.rol === "ADMIN" ? "Administrador" : "Usuario"}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Estado</label>
              <p>
                <span
                  className={
                    usuario.status
                      ? "inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }
                >
                  {usuario.status ? "Activo" : "Inactivo"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DetallesModal>
  );
};
