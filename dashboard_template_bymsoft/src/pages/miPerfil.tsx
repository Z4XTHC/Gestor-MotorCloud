/**
 * @file miPerfil.tsx
 * @description Página de perfil de usuario para técnicos y administradores
 * @version 1.0
 * @date 02/02/2026
 */

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Loading } from "../components/common/Loading";
import {
  User,
  Camera,
  Mail,
  Lock,
  Save,
  X,
  Edit,
  FileSignature,
  Eye,
  EyeOff,
} from "lucide-react";
import Swal from "sweetalert2";
import axiosInstance from "../api/axiosConfig";

interface PerfilData {
  nombre: string;
  apellido: string;
  email: string;
  fotoPerfil?: string;
  firmaDigital?: string;
}

export default function MiPerfil() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs para los inputs de archivos
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const firmaInputRef = useRef<HTMLInputElement>(null);

  // Estados del formulario
  const [formData, setFormData] = useState<PerfilData>({
    nombre: "",
    apellido: "",
    email: "",
    fotoPerfil: "",
    firmaDigital: "",
  });

  const [passwords, setPasswords] = useState({
    nuevaPassword: "",
    confirmarPassword: "",
  });

  // Preview de imágenes
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [firmaPreview, setFirmaPreview] = useState<string>("");

  // Cargar datos iniciales del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        username: user.username || "",
        fotoPerfil: user.fotoPerfil || "",
        firmaDigital: user.firmaDigital || "",
      });
      setFotoPreview(user.fotoPerfil || "");
      setFirmaPreview(user.firmaDigital || "");
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de foto de perfil
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, seleccione una imagen válida (JPG, PNG, GIF)",
      });
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La imagen no debe superar los 5MB",
      });
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Manejar cambio de firma digital
  const handleFirmaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, seleccione una imagen válida (JPG, PNG, GIF)",
      });
      return;
    }

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La firma no debe superar los 2MB",
      });
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFirmaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nombre y apellido son obligatorios",
      });
      return;
    }

    // Validar contraseñas si se están cambiando
    if (passwords.nuevaPassword || passwords.confirmarPassword) {
      if (passwords.nuevaPassword !== passwords.confirmarPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Las contraseñas no coinciden",
        });
        return;
      }

      if (passwords.nuevaPassword.length < 6) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La contraseña debe tener al menos 6 caracteres",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("apellido", formData.apellido);

      // Agregar contraseña si se cambió
      if (passwords.nuevaPassword) {
        formDataToSend.append("password", passwords.nuevaPassword);
      }

      // Agregar foto de perfil si se cambió
      if (fotoInputRef.current?.files?.[0]) {
        formDataToSend.append("fotoPerfil", fotoInputRef.current.files[0]);
      }

      // Agregar firma digital si se cambió
      if (firmaInputRef.current?.files?.[0]) {
        formDataToSend.append("firmaDigital", firmaInputRef.current.files[0]);
      }

      const response = await axiosInstance.put(
        `/api/usuarios/${user?._id || user?.id}/perfil`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Actualizar contexto de usuario
      if (response.data) {
        updateUser(response.data);
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Perfil actualizado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      // Limpiar campos de contraseña
      setPasswords({
        nuevaPassword: "",
        confirmarPassword: "",
      });

      // Salir del modo edición
      setEditMode(false);
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.mensaje ||
          "No se pudo actualizar el perfil. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        username: user.username || "",
        fotoPerfil: user.fotoPerfil || "",
        firmaDigital: user.firmaDigital || "",
      });
      setFotoPreview(user.fotoPerfil || "");
      setFirmaPreview(user.firmaDigital || "");
    }

    // Limpiar contraseñas
    setPasswords({
      nuevaPassword: "",
      confirmarPassword: "",
    });

    // Limpiar inputs de archivo
    if (fotoInputRef.current) fotoInputRef.current.value = "";
    if (firmaInputRef.current) firmaInputRef.current.value = "";

    setEditMode(false);
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mi Perfil
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Administra tu información personal y configuración de cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Columna Izquierda - Foto de Perfil y Firma */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            {/* Foto de Perfil */}
            <Card className="flex-1">
              <div className="flex flex-col items-center justify-between h-full py-6 px-4">
                <div className="w-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                    Foto de Perfil
                  </h3>

                  {/* Avatar/Foto Preview */}
                  <div className="relative flex justify-center mb-6">
                    <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-4 border-primary/20 dark:border-dark-primary/30 shadow-lg">
                      {fotoPreview ? (
                        <img
                          src={fotoPreview}
                          alt="Foto de perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-24 h-24 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {editMode && (
                      <button
                        type="button"
                        onClick={() => fotoInputRef.current?.click()}
                        className="absolute bottom-2 right-1/2 translate-x-20 p-3 bg-primary hover:bg-primary-dark text-white rounded-full shadow-xl transition-all hover:scale-110"
                        title="Cambiar foto"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <input
                    ref={fotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="hidden"
                    disabled={!editMode}
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {editMode
                      ? "Haz clic en el ícono de cámara para cambiar tu foto"
                      : "Activa el modo edición para cambiar tu foto"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    JPG, PNG o GIF • Máx. 5MB
                  </p>
                </div>
              </div>
            </Card>

            {/* Firma Digital */}
            <Card className="flex-1">
              <div className="flex flex-col justify-between h-full py-6 px-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                    Firma Digital
                  </h3>

                  {/* Preview de firma */}
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center p-4 mb-4">
                    {firmaPreview ? (
                      <img
                        src={firmaPreview}
                        alt="Firma digital"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <FileSignature className="w-16 h-16 mx-auto mb-3" />
                        <p className="text-sm font-medium">Sin firma cargada</p>
                      </div>
                    )}
                  </div>

                  <input
                    ref={firmaInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFirmaChange}
                    className="hidden"
                    disabled={!editMode}
                  />

                  {editMode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      className="w-full mb-4"
                      onClick={() => firmaInputRef.current?.click()}
                    >
                      <FileSignature className="w-4 h-4" />
                      {firmaPreview ? "Cambiar Firma" : "Subir Firma"}
                    </Button>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-500 text-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  Formato de imagen • Máx. 2MB
                </p>
              </div>
            </Card>
          </div>

          {/* Columna Derecha - Datos Personales */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <Card className="flex-1">
              <div className="flex flex-col h-full py-6 px-6">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Información Personal
                  </h3>
                  {!editMode && (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setEditMode(true)}
                      icon={<Edit className="w-4 h-4" />}
                    >
                      Editar Perfil
                    </Button>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                      placeholder="Ingresa tu nombre"
                    />
                    <Input
                      label="Apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                      placeholder="Ingresa tu apellido"
                    />
                  </div>

                  {/* Email (no editable) */}
                  <div>
                    <Input
                      label="Email"
                      name="email"
                      value={formData.email}
                      disabled
                      type="email"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      El email no puede ser modificado por seguridad
                    </p>
                  </div>

                  {/* Cambio de Contraseña (solo en modo edición) */}
                  {editMode && (
                    <div className="pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                      <div className="mb-5">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                          <Lock className="w-5 h-5 text-primary" />
                          Cambiar Contraseña
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                          Deja los campos en blanco si no deseas cambiar tu
                          contraseña
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            label="Nueva Contraseña"
                            name="nuevaPassword"
                            type={showPassword ? "text" : "password"}
                            value={passwords.nuevaPassword}
                            onChange={handlePasswordChange}
                            placeholder="Mínimo 6 caracteres"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {passwords.nuevaPassword && (
                          <div className="relative">
                            <Input
                              label="Confirmar Nueva Contraseña"
                              name="confirmarPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwords.confirmarPassword}
                              onChange={handlePasswordChange}
                              placeholder="Repite la contraseña"
                              error={
                                passwords.confirmarPassword &&
                                passwords.nuevaPassword !==
                                  passwords.confirmarPassword
                                  ? "Las contraseñas no coinciden"
                                  : undefined
                              }
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  {editMode && (
                    <div className="flex gap-3 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        loading={loading}
                        icon={<Save className="w-4 h-4" />}
                      >
                        Guardar Cambios
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1"
                        icon={<X className="w-4 h-4" />}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}

                  {/* Información de Cuenta */}
                  <div className="pt-8 mt-8 border-t-2 border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pb-4 mb-5">
                      Información de Cuenta
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 dark:bg-dark-primary/10 rounded-lg">
                          <User className="w-5 h-5 text-primary dark:text-dark-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Rol
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {user.rol === "ADMIN" ? "Administrador" : "Usuario"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Estado de Cuenta
                          </p>
                          <p className="font-semibold text-green-600">Activa</p>
                        </div>
                      </div>
                      {user.createdAt && (
                        <div className="flex items-start gap-3 sm:col-span-2">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <svg
                              className="w-5 h-5 text-blue-600 dark:text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              Miembro desde
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {new Date(user.createdAt).toLocaleDateString(
                                "es-AR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
