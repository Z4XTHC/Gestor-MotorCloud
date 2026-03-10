import { useState, useEffect } from "react";
import {
  Search,
  User,
  Plus,
  Phone,
  Car,
  Mail,
  MapPin,
  CreditCard,
  Edit,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  ArrowLeft,
  Target,
  Shield,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { TableSkeleton } from "../../components/common/TableSkeleton";
import {
  showSuccess,
  showError,
  showConfirm,
} from "../../components/common/SweetAlert";
import { Usuario } from "../../types/usuario";
import { obtenerUsuarios, actualizarEstadoUsuario } from "../../api/userApi";
import { UsuariosForm } from "./UsuariosForm";
import { Card } from "../../components/common/Card";

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  // Modales
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

  // Flujo: tras crear usuario, preguntar si agregar vehículo
  const [usuarioRecienCreado, setUsuarioRecienCreado] =
    useState<Usuario | null>(null);
  const [showVehiculoForm, setShowVehiculoForm] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch {
      showError("Error", "No se pudo cargar la lista de usuarios.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(
    (u) =>
      `${u.nombre} ${u.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.rol || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // === Flujo post-creación de usuario ===
  const handleUsuarioCreado = async (nuevoUsuario?: Usuario) => {
    await fetchUsuarios();
    if (!nuevoUsuario) return;
    setSelectedUsuario(nuevoUsuario);
    showSuccess(
      "Usuario creado",
      `${nuevoUsuario.nombre} ${nuevoUsuario.apellido} fue registrado correctamente.`,
      2000,
    );
  };

  const handleUsuarioEditado = async (usuarioActualizado?: Usuario) => {
    await fetchUsuarios();
    if (usuarioActualizado) {
      setSelectedUsuario(usuarioActualizado);
      showSuccess(
        "Actualizado",
        "Los datos del usuario fueron actualizados.",
        2000,
      );
    }
  };

  const handleToggleStatus = async (usuario: Usuario) => {
    const nuevoEstado = !usuario.status;
    const accion = nuevoEstado ? "activar" : "desactivar";
    const res = await showConfirm(
      `¿${nuevoEstado ? "Activar" : "Desactivar"} usuario?`,
      `¿Deseas ${accion} a ${usuario.nombre} ${usuario.apellido}?`,
      `Sí, ${accion}`,
      "Cancelar",
    );
    if (!res.isConfirmed) return;
    try {
      await actualizarEstadoUsuario({
        id: String(usuario.id),
        status: nuevoEstado,
      });
      showSuccess(
        nuevoEstado ? "Activado" : "Desactivado",
        "Estado del usuario actualizado.",
        1800,
      );
      await fetchUsuarios();
      if (selectedUsuario?.id === usuario.id) {
        setSelectedUsuario((prev) =>
          prev ? { ...prev, status: nuevoEstado } : null,
        );
      }
    } catch {
      showError("Error", `No se pudo ${accion} el usuario.`);
    }
  };

  return (
    <main className="p-4 lg:p-6" role="main">
      {/* === ENCABEZADO === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {loading
              ? "Cargando..."
              : `${usuarios.length} usuario${usuarios.length !== 1 ? "s" : ""} registrado${usuarios.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-500 border-primary-500 text-white hover:bg-primary-600 dark:border-primary-400 dark:text-white dark:hover:bg-primary-700 transition-colors"
        >
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* ===== PANEL IZQUIERDO: Lista de usuarios ===== */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-4">
                <TableSkeleton columns={1} rows={5} />
              </div>
            ) : (
              <div className="max-h-[560px] overflow-y-auto">
                {filteredUsuarios.length === 0 ? (
                  <div className="p-8 text-center">
                    <User className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {searchTerm
                        ? `Sin resultados para "${searchTerm}"`
                        : "No hay usuarios registrados"}
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredUsuarios.map((usuario) => (
                      <button
                        key={usuario.id}
                        onClick={() => setSelectedUsuario(usuario)}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          selectedUsuario?.id === usuario.id
                            ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              usuario.status
                                ? "bg-primary-100 dark:bg-primary-900/20"
                                : "bg-neutral-100 dark:bg-neutral-700"
                            }`}
                          >
                            <User
                              className={`w-4 h-4 ${
                                usuario.status
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-neutral-400 dark:text-neutral-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                                {usuario.nombre} {usuario.apellido}
                              </span>
                              {!usuario.status && (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 shrink-0">
                                  Inactivo
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              {usuario.username} • {usuario.rol}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ===== PANEL DERECHO: Detalle del usuario ===== */}
        <div className="lg:col-span-2">
          {selectedUsuario ? (
            <div className="space-y-4 lg:space-y-5">
              {/* Cabecera del usuario */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                          {selectedUsuario.nombre} {selectedUsuario.apellido}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            selectedUsuario.status
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {selectedUsuario.status ? (
                            <ToggleRight className="w-3 h-3" />
                          ) : (
                            <ToggleLeft className="w-3 h-3" />
                          )}
                          {selectedUsuario.status ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                        <p className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5" />{" "}
                          {selectedUsuario.username}
                        </p>
                        <p className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5" />{" "}
                          {selectedUsuario.rol}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      icon={<Edit className="w-4 h-4" />}
                      variant="outline"
                      onClick={() => setEditingUsuario(selectedUsuario)}
                    >
                      Editar
                    </Button>
                    <button
                      onClick={() => handleToggleStatus(selectedUsuario)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        selectedUsuario.status
                          ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {selectedUsuario.status ? (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5" /> Desactivar
                        </>
                      ) : (
                        <>
                          <ToggleRight className="w-3.5 h-3.5" /> Activar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
              <div className="p-12 text-center">
                <User className="w-14 h-14 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                  Selecciona un cliente
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Elige un cliente de la lista para ver su información y
                  vehículos registrados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL: Crear Usuario ===== */}
      <Modal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Nuevo Usuario"
        icon={
          <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <UsuariosForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={(nuevo) => {
            setShowCreateForm(false);
            handleUsuarioCreado(nuevo);
          }}
        />
      </Modal>

      {/* ===== MODAL: Editar Usuario ===== */}
      <Modal
        isOpen={!!editingUsuario}
        onClose={() => setEditingUsuario(null)}
        title="Editar Usuario"
        icon={
          <Edit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        }
        maxWidth="lg"
        noPadding
      >
        <UsuariosForm
          usuario={editingUsuario}
          onClose={() => setEditingUsuario(null)}
          onSuccess={(actualizado) => {
            setEditingUsuario(null);
            handleUsuarioEditado(actualizado);
          }}
        />
      </Modal>
    </main>
  );
}
