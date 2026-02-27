import React, { useState, useMemo, useRef } from "react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Table, Column } from "../components/common/Table";
import { Input } from "../components/common/Input";
import { SearchableSelect } from "../components/common/SearchableSelect";
import { Modal } from "../components/common/Modal";
import {
  showSuccess,
  showError,
  showConfirm,
  showCustom,
} from "../components/common/SweetAlert";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Upload,
} from "lucide-react";

// Datos de ejemplo para la tabla
const datosEjemplo = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    rol: "Administrador",
    estado: "Activo",
    fechaRegistro: "2024-01-15",
    ultimoAcceso: "2024-02-04",
  },
  {
    id: "2",
    nombre: "María García",
    email: "maria.garcia@email.com",
    rol: "Usuario",
    estado: "Activo",
    fechaRegistro: "2024-01-20",
    ultimoAcceso: "2024-02-03",
  },
  {
    id: "3",
    nombre: "Carlos López",
    email: "carlos.lopez@email.com",
    rol: "Moderador",
    estado: "Inactivo",
    fechaRegistro: "2024-01-10",
    ultimoAcceso: "2024-01-25",
  },
  {
    id: "4",
    nombre: "Ana Rodríguez",
    email: "ana.rodriguez@email.com",
    rol: "Usuario",
    estado: "Activo",
    fechaRegistro: "2024-01-25",
    ultimoAcceso: "2024-02-02",
  },
  {
    id: "5",
    nombre: "Pedro Martínez",
    email: "pedro.martinez@email.com",
    rol: "Usuario",
    estado: "Pendiente",
    fechaRegistro: "2024-02-01",
    ultimoAcceso: null,
  },
];

type SortField =
  | "nombre"
  | "email"
  | "rol"
  | "estado"
  | "fechaRegistro"
  | "ultimoAcceso";
type SortDirection = "asc" | "desc" | null;

const SamplePage2: React.FC = () => {
  const [search, setSearch] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>("fechaRegistro");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Estados para modales y simulaciones
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [simulatedData, setSimulatedData] = useState(datosEjemplo);

  // Estados para el formulario de creación
  const [newUserForm, setNewUserForm] = useState({
    nombre: "",
    email: "",
    rol: "",
    estado: "",
  });

  // Estados para el formulario de edición
  const [editUserForm, setEditUserForm] = useState({
    nombre: "",
    email: "",
    rol: "",
    estado: "",
  });

  // Definición de columnas
  const columnas: Column[] = [
    { key: "nombre", label: "Nombre", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "rol", label: "Rol", align: "center", sortable: true },
    { key: "estado", label: "Estado", align: "center", sortable: true },
    {
      key: "fechaRegistro",
      label: "Fecha Registro",
      align: "center",
      sortable: true,
    },
    {
      key: "ultimoAcceso",
      label: "Último Acceso",
      align: "center",
      sortable: true,
    },
    { key: "acciones", label: "Acciones", align: "center" },
  ];

  // Filtrado y ordenamiento
  const filteredAndSortedData = useMemo(() => {
    let filtered = simulatedData.filter((item) => {
      // Filtro de búsqueda
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          item.nombre.toLowerCase().includes(searchLower) ||
          item.email.toLowerCase().includes(searchLower) ||
          item.rol.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtro de rol
      if (rolFilter && item.rol !== rolFilter) {
        return false;
      }

      // Filtro de estado
      if (estadoFilter && item.estado !== estadoFilter) {
        return false;
      }

      return true;
    });

    // Ordenamiento
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return sortDirection === "desc" ? -comparison : comparison;
      });
    }

    return filtered;
  }, [
    simulatedData,
    search,
    rolFilter,
    estadoFilter,
    sortField,
    sortDirection,
  ]);

  // Paginación
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Funciones de ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field as SortField);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    if (sortDirection === "asc") return <ArrowUp className="w-4 h-4" />;
    if (sortDirection === "desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  // Funciones de acción simuladas
  const handleView = (id: string) => {
    const user = simulatedData.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setShowViewModal(true);
    }
  };

  const handleEdit = (id: string) => {
    const user = simulatedData.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setEditUserForm({
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        estado: user.estado,
      });
      setShowEditModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    const user = simulatedData.find((u) => u.id === id);
    if (!user) return;

    const result = await showConfirm(
      "¿Eliminar usuario?",
      `¿Estás seguro de que quieres eliminar a ${user.nombre}? Esta acción no se puede deshacer.`,
      "Sí, eliminar",
      "Cancelar",
    );

    if (result.isConfirmed) {
      try {
        // Simular llamada a API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Eliminar de los datos simulados
        setSimulatedData((prev) => prev.filter((u) => u.id !== id));

        showSuccess(
          "¡Eliminado!",
          `El usuario ${user.nombre} ha sido eliminado exitosamente.`,
          2000,
        );
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        showError(
          "Error",
          "No se pudo eliminar el usuario. Inténtalo de nuevo.",
        );
      }
    }
  };

  const handleResendEmail = async (id: string) => {
    const user = simulatedData.find((u) => u.id === id);
    if (!user) return;

    const result = await showConfirm(
      "Reenviar email",
      `¿Desea reenviar el email de activación a ${user.email}?`,
      "Sí, reenviar",
      "Cancelar",
    );

    if (result.isConfirmed) {
      try {
        // Simular llamada a API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        showSuccess(
          "¡Enviado!",
          `El email fue reenviado exitosamente a ${user.email}.`,
          2000,
        );
      } catch (error) {
        console.error("Error reenviando email:", error);
        showError("Error", "No se pudo reenviar el email. Inténtalo de nuevo.");
      }
    }
  };

  const handleSaveEdit = () => {
    // Validaciones básicas
    if (
      !editUserForm.nombre ||
      !editUserForm.email ||
      !editUserForm.rol ||
      !editUserForm.estado
    ) {
      showError("Campos requeridos", "Por favor completa todos los campos.");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editUserForm.email)) {
      showError("Email inválido", "Por favor ingresa un email válido.");
      return;
    }

    // Verificar email único (excluyendo el usuario actual)
    const emailExists = simulatedData.some(
      (user) =>
        user.email.toLowerCase() === editUserForm.email.toLowerCase() &&
        user.id !== selectedUser.id,
    );

    if (emailExists) {
      showError("Email duplicado", "Ya existe otro usuario con este email.");
      return;
    }

    // Actualizar usuario
    setSimulatedData((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id ? { ...user, ...editUserForm } : user,
      ),
    );

    showSuccess(
      "¡Guardado!",
      `El usuario ${editUserForm.nombre} ha sido actualizado exitosamente.`,
      2000,
    );

    setShowEditModal(false);
    setSelectedUser(null);
  };

  // Función para crear nuevo registro
  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  // Función para guardar nuevo registro
  const handleSaveNew = () => {
    // Validaciones básicas
    if (
      !newUserForm.nombre ||
      !newUserForm.email ||
      !newUserForm.rol ||
      !newUserForm.estado
    ) {
      showError("Campos requeridos", "Por favor completa todos los campos.");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserForm.email)) {
      showError("Email inválido", "Por favor ingresa un email válido.");
      return;
    }

    // Verificar email único
    const emailExists = simulatedData.some(
      (user) => user.email.toLowerCase() === newUserForm.email.toLowerCase(),
    );

    if (emailExists) {
      showError("Email duplicado", "Ya existe un usuario con este email.");
      return;
    }

    // Simular creación con ID único
    const newUser = {
      ...newUserForm,
      id: Date.now().toString(),
      fechaRegistro: new Date().toISOString().split("T")[0],
      ultimoAcceso: null,
    };

    setSimulatedData((prev) => [...prev, newUser]);

    showSuccess(
      "¡Creado!",
      `El usuario ${newUser.nombre} ha sido creado exitosamente.`,
      2000,
    );

    setShowCreateModal(false);
    setNewUserForm({ nombre: "", email: "", rol: "", estado: "" });
  };

  // Función para exportar datos
  const handleExportData = () => {
    try {
      // Crear CSV con los datos filtrados
      const headers = [
        "Nombre",
        "Email",
        "Rol",
        "Estado",
        "Fecha Registro",
        "Último Acceso",
      ];
      const csvData = filteredAndSortedData.map((item) => [
        item.nombre,
        item.email,
        item.rol,
        item.estado,
        item.fechaRegistro,
        item.ultimoAcceso || "Nunca",
      ]);

      // Agregar headers al inicio
      csvData.unshift(headers);

      // Convertir a CSV string
      const csvContent = csvData
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `usuarios_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess(
        "¡Exportado!",
        `Se han exportado ${filteredAndSortedData.length} registros a CSV.`,
        2000,
      );
    } catch (error) {
      console.error("Error exportando datos:", error);
      showError("Error", "No se pudo exportar los datos. Inténtalo de nuevo.");
    }
  };

  // Función para importar datos
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.name.endsWith(".csv")) {
      showError("Archivo inválido", "Por favor selecciona un archivo CSV.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          throw new Error(
            "El archivo debe contener al menos un header y una fila de datos",
          );
        }

        // Parsear CSV (simple, sin librerías externas)
        const headers = lines[0]
          .split(",")
          .map((h) => h.replace(/"/g, "").trim());
        const expectedHeaders = ["Nombre", "Email", "Rol", "Estado"];

        // Verificar headers básicos
        const hasRequiredHeaders = expectedHeaders.every((header) =>
          headers.some((h) => h.toLowerCase().includes(header.toLowerCase())),
        );

        if (!hasRequiredHeaders) {
          throw new Error(
            "El archivo CSV debe contener las columnas: Nombre, Email, Rol, Estado",
          );
        }

        const importedUsers = [];
        let successCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          try {
            const values = lines[i]
              .split(",")
              .map((v) => v.replace(/"/g, "").trim());

            if (values.length >= 4) {
              const [nombre, email, rol, estado] = values;

              // Validaciones básicas
              if (!nombre || !email || !rol || !estado) {
                errorCount++;
                continue;
              }

              // Verificar si el email ya existe
              const emailExists = simulatedData.some(
                (user) => user.email.toLowerCase() === email.toLowerCase(),
              );

              if (emailExists) {
                errorCount++;
                continue;
              }

              const newUser = {
                id: `import_${Date.now()}_${i}`,
                nombre,
                email,
                rol,
                estado,
                fechaRegistro: new Date().toISOString().split("T")[0],
                ultimoAcceso: null,
              };

              importedUsers.push(newUser);
              successCount++;
            }
          } catch (error) {
            errorCount++;
          }
        }

        // Agregar usuarios importados
        if (importedUsers.length > 0) {
          setSimulatedData((prev) => [...prev, ...importedUsers]);
        }

        // Mostrar resultado
        showCustom({
          icon: successCount > 0 ? "success" : "warning",
          title: successCount > 0 ? "¡Importado!" : "Importación completada",
          html: `
            <div class="text-left">
              <p><strong>Registros importados:</strong> ${successCount}</p>
              ${errorCount > 0 ? `<p><strong>Errores:</strong> ${errorCount}</p>` : ""}
              ${errorCount > 0 ? '<p class="text-sm text-gray-600 mt-2">Los errores pueden deberse a emails duplicados, datos faltantes o formato incorrecto.</p>' : ""}
            </div>
          `,
          confirmButtonColor: "#F39F23",
        });
      } catch (error) {
        console.error("Error procesando archivo:", error);
        showError(
          "Error al procesar archivo",
          error instanceof Error
            ? error.message
            : "Formato de archivo inválido.",
        );
      }
    };

    reader.readAsText(file);
    // Limpiar input
    event.target.value = "";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Página de Ejemplo 2 - Tabla Completa
      </h1>

      {/* Sección de Acciones */}
      <Card title="Acciones de Ejemplo" className="p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <Button variant="primary" onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Registro
          </Button>
          <Button variant="secondary" onClick={handleExportData}>
            Exportar Datos
          </Button>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            Importar Datos
          </Button>
        </div>
      </Card>

      {/* Sección de Tabla Completa */}
      <Card title="Tabla Completa con TanStack Table" className="p-4">
        {/* Controles de filtrado y búsqueda */}
        <div className="mb-6 space-y-4">
          {/* Barra de búsqueda y filtros en la misma fila */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, email o rol..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex flex-row gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Rol:
                </span>
                <SearchableSelect
                  value={rolFilter}
                  onChange={setRolFilter}
                  options={[
                    { value: "", label: "Todos los roles" },
                    { value: "Administrador", label: "Administrador" },
                    { value: "Moderador", label: "Moderador" },
                    { value: "Usuario", label: "Usuario" },
                  ]}
                  placeholder="Seleccionar rol"
                  className="min-w-[140px] w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Estado:
                </span>
                <SearchableSelect
                  value={estadoFilter}
                  onChange={setEstadoFilter}
                  options={[
                    { value: "", label: "Todos los estados" },
                    { value: "Activo", label: "Activo" },
                    { value: "Inactivo", label: "Inactivo" },
                    { value: "Pendiente", label: "Pendiente" },
                  ]}
                  placeholder="Seleccionar estado"
                  className="min-w-[140px] w-full"
                />
              </div>
            </div>
          </div>

          {/* Selector de items por página */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mostrar:
              </span>
              <SearchableSelect
                value={itemsPerPage.toString()}
                onChange={(value) => setItemsPerPage(Number(value))}
                options={[
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "15", label: "15" },
                  { value: "20", label: "20" },
                ]}
                placeholder="Seleccionar"
                className="min-w-[80px] w-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                registros por página
              </span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {totalItems} registro{totalItems !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Tabla usando componentes de common */}
        <Table
          columns={columnas}
          data={paginatedData}
          loading={false}
          search={search}
          isFiltering={!!search || !!rolFilter || !!estadoFilter}
          emptyMessage={(search) =>
            search
              ? `No se encontraron resultados para "${search}"`
              : "No hay registros para mostrar"
          }
          onSort={handleSort}
          getSortIcon={getSortIcon}
          pagination={{
            currentPage,
            setCurrentPage,
            itemsPerPage,
            totalItems,
            label: "registros",
          }}
          renderRow={(item, index) => (
            <>
              <td className="py-4 px-4 text-gray-900 dark:text-dark-text font-medium">
                {item.nombre}
              </td>
              <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                {item.email}
              </td>
              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    item.rol === "Administrador"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : item.rol === "Moderador"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                  }`}
                >
                  {item.rol}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    item.estado === "Activo"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : item.estado === "Inactivo"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {item.estado}
                </span>
              </td>
              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                {new Date(item.fechaRegistro).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                {item.ultimoAcceso
                  ? new Date(item.ultimoAcceso).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Nunca"}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleView(item.id)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-blue-600"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-yellow-600"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {item.estado === "Pendiente" && (
                    <button
                      onClick={() => handleResendEmail(item.id)}
                      className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-green-600"
                      title="Reenviar email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </Card>

      {/* Modales */}
      <>
        {/* Modal de Crear Nuevo Registro */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nuevo Registro de Usuario"
          size="lg"
          footer={
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const form = document.getElementById(
                    "create-user-form",
                  ) as HTMLFormElement;
                  if (form) {
                    const formData = new FormData(form);
                    const newUserData = {
                      nombre: formData.get("nombre") as string,
                      email: formData.get("email") as string,
                      rol: formData.get("rol") as string,
                      estado: formData.get("estado") as string,
                    };

                    // Validaciones básicas
                    if (
                      !newUserData.nombre ||
                      !newUserData.email ||
                      !newUserData.rol ||
                      !newUserData.estado
                    ) {
                      showError(
                        "Campos requeridos",
                        "Por favor completa todos los campos.",
                      );
                      return;
                    }

                    // Validar email
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(newUserData.email)) {
                      showError(
                        "Email inválido",
                        "Por favor ingresa un email válido.",
                      );
                      return;
                    }

                    // Verificar email único
                    const emailExists = simulatedData.some(
                      (user) =>
                        user.email.toLowerCase() ===
                        newUserData.email.toLowerCase(),
                    );

                    if (emailExists) {
                      showError(
                        "Email duplicado",
                        "Ya existe un usuario con este email.",
                      );
                      return;
                    }

                    handleSaveNew();
                  }
                }}
              >
                Crear Usuario
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre *
                </label>
                <Input
                  type="text"
                  value={newUserForm.nombre}
                  onChange={(e) =>
                    setNewUserForm((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  required
                  className="w-full"
                  placeholder="Ingresa el nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                  className="w-full"
                  placeholder="usuario@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol *
                </label>
                <SearchableSelect
                  value={newUserForm.rol}
                  onChange={(value) =>
                    setNewUserForm((prev) => ({ ...prev, rol: value }))
                  }
                  options={[
                    { value: "Usuario", label: "Usuario" },
                    { value: "Moderador", label: "Moderador" },
                    { value: "Administrador", label: "Administrador" },
                  ]}
                  placeholder="Seleccionar rol"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado *
                </label>
                <SearchableSelect
                  value={newUserForm.estado}
                  onChange={(value) =>
                    setNewUserForm((prev) => ({ ...prev, estado: value }))
                  }
                  options={[
                    { value: "Activo", label: "Activo" },
                    { value: "Inactivo", label: "Inactivo" },
                    { value: "Pendiente", label: "Pendiente" },
                  ]}
                  placeholder="Seleccionar estado"
                  className="w-full"
                />
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Nota:</strong> Esta es una simulación. En una aplicación
                real, los datos se guardarían en la base de datos.
              </p>
            </div>
          </div>
        </Modal>
        {/* Modal de Ver Detalles */}
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title="Detalles del Usuario"
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre
                  </label>
                  <p className="text-gray-900 dark:text-dark-text font-medium">
                    {selectedUser.nombre}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rol
                  </label>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUser.rol === "Administrador"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : selectedUser.rol === "Moderador"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                    }`}
                  >
                    {selectedUser.rol}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.estado === "Activo"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : selectedUser.estado === "Inactivo"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {selectedUser.estado}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha de Registro
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {new Date(selectedUser.fechaRegistro).toLocaleDateString(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Último Acceso
                  </label>
                  <p className="text-gray-900 dark:text-dark-text">
                    {selectedUser.ultimoAcceso
                      ? new Date(selectedUser.ultimoAcceso).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "Nunca ha accedido"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal de Editar */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Editar Usuario"
          size="lg"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Guardar Cambios
              </Button>
            </div>
          }
        >
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre
                  </label>
                  <Input
                    type="text"
                    value={editUserForm.nombre}
                    onChange={(e) =>
                      setEditUserForm((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) =>
                      setEditUserForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rol
                  </label>
                  <SearchableSelect
                    value={editUserForm.rol}
                    onChange={(value) =>
                      setEditUserForm((prev) => ({ ...prev, rol: value }))
                    }
                    options={[
                      { value: "Usuario", label: "Usuario" },
                      { value: "Moderador", label: "Moderador" },
                      { value: "Administrador", label: "Administrador" },
                    ]}
                    placeholder="Seleccionar rol"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                  </label>
                  <SearchableSelect
                    value={editUserForm.estado}
                    onChange={(value) =>
                      setEditUserForm((prev) => ({ ...prev, estado: value }))
                    }
                    options={[
                      { value: "Activo", label: "Activo" },
                      { value: "Inactivo", label: "Inactivo" },
                      { value: "Pendiente", label: "Pendiente" },
                    ]}
                    placeholder="Seleccionar estado"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Nota:</strong> Esta es una simulación. En una
                  aplicación real, los cambios se guardarían en la base de
                  datos.
                </p>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal de Importar Datos */}
        <ImportDataModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportData}
        />
      </>
    </div>
  );
};

const ImportDataModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ isOpen, onClose, onImport }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ".csv";
  const maxSize = 5 * 1024 * 1024; // 5MB

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Validar tipo de archivo
    if (!file.name.endsWith(".csv")) {
      showError("Archivo inválido", "Por favor selecciona un archivo CSV.");
      return;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      showError(
        "Archivo demasiado grande",
        `El archivo no puede superar los ${maxSize / (1024 * 1024)}MB.`,
      );
      return;
    }

    setSelectedFile(file);
  };

  const handleImport = () => {
    if (!selectedFile) return;

    // Crear un evento sintético para mantener la compatibilidad
    const syntheticEvent = {
      target: { files: [selectedFile] },
    } as React.ChangeEvent<HTMLInputElement>;

    onImport(syntheticEvent);
    setSelectedFile(null);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Importar Datos"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!selectedFile}
          >
            Importar Archivo
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información de archivos aceptados */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Información de archivos
          </h4>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>
              <strong>Formatos aceptados:</strong> {acceptedTypes}
            </p>
            <p>
              <strong>Tamaño máximo:</strong> {maxSize / (1024 * 1024)}MB
            </p>
            <p>
              <strong>Columnas requeridas:</strong> Nombre, Email, Rol, Estado
            </p>
          </div>
        </div>

        {/* Zona de drag & drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragOver
              ? "border-primary bg-primary-lighter dark:bg-primary/10"
              : selectedFile
                ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-primary"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-3">
              <div className="text-green-600 dark:text-green-400">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-dark-text">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Haz clic para seleccionar otro archivo
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-dark-text">
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  o haz clic para seleccionar un archivo
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Vista previa de datos esperados */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
            Formato esperado del archivo CSV
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium">Nombre</th>
                  <th className="text-left py-2 px-3 font-medium">Email</th>
                  <th className="text-left py-2 px-3 font-medium">Rol</th>
                  <th className="text-left py-2 px-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">
                    Juan Pérez
                  </td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">
                    juan@email.com
                  </td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">
                    Usuario
                  </td>
                  <td className="py-2 px-3 text-gray-600 dark:text-gray-400">
                    Activo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            La primera fila debe contener los encabezados. Los datos se
            validarán automáticamente durante la importación.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SamplePage2;
