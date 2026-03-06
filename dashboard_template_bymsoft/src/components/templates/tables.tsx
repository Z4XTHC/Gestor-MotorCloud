// =============================================================
// PLANTILLA: Lista con tabla paginada, filtros y ordenamiento
// =============================================================
// PASOS PARA ADAPTAR:
//  1. Reemplazar "Entidad" / "entidad" / "entidades" por el nombre real (ej: Cliente, Producto)
//  2. Reemplazar "EntidadType" por el tipo TypeScript de tu entidad
//  3. Ajustar los imports de API (obtenerXxx, actualizarEstadoXxx)
//  4. Definir los campos de SortField según los campos de tu entidad
//  5. Actualizar "columnas" con las columnas reales de tu tabla
//  6. Actualizar el bloque de filtros según los campos filtrables
//  7. Actualizar filteredAndSortedData con la lógica de filtro correcta
//  8. Actualizar renderRow con las celdas correspondientes a tus campos
//  9. Ajustar el toggle de estado si tu entidad no lo necesita (puedes eliminarlo)
// 10. Importar los componentes de detalle/form/confirm propios de la entidad
// =============================================================

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ToggleLeft,   // [OPCIONAL] Solo si la entidad tiene toggle de estado
  ToggleRight,  // [OPCIONAL] Solo si la entidad tiene toggle de estado
} from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { Loading } from "../common/Loading";
import { Input } from "../common/Input";
import { SearchableSelect } from "../common/SearchableSelect";
import { Column, Table } from "../common/Table";
import Swal from "sweetalert2";
import { showError } from "../common/SweetAlert";

// [TODO] Reemplazar por el tipo real de tu entidad
// import { EntidadType } from "../../types/entidad";

// [TODO] Reemplazar por las funciones de API correspondientes
// import { obtenerEntidades, actualizarEstadoEntidad } from "../../api/entidadApi";

// [TODO] Importar los componentes propios de la entidad
// import { EntidadDetalles } from "../../pages/entidad/EntidadDetalles";
// import { EntidadForm } from "../../pages/entidad/EntidadForm";
// import { confirmarEliminarEntidad } from "../../pages/entidad/EntidadConfirm";

// [TODO] Definir los campos por los que se puede ordenar
// Ejemplo de usuario: "nombre" | "apellido" | "username" | "rol" | "status"
type SortField = "campo1" | "campo2" | "campo3";
type SortDirection = "asc" | "desc" | null;

// [TODO] Renombrar el componente: EntidadList
export const EntidadList = () => {
  // [TODO] Renombrar estados: entidades / setEntidades, selectedEntidad, editingEntidad
  const [entidades, setEntidades] = useState<any[]>([]); // [TODO] tipado con EntidadType[]
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // [OPCIONAL] Filtros adicionales según campos de la entidad
  // Ejemplo: filtro por rol, por estado, por categoría, etc.
  const [filtro1, setFiltro1] = useState("");       // [TODO] Renombrar o eliminar
  const [estadoFilter, setEstadoFilter] = useState(""); // [OPCIONAL] Si hay estado activo/inactivo

  const [selectedEntidad, setSelectedEntidad] = useState<any | null>(null);
  const [editingEntidad, setEditingEntidad] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>("campo1"); // [TODO] campo inicial de orden
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // [TODO] Renombrar a fetchEntidades
  const fetchEntidades = async () => {
    setLoading(true);
    try {
      // [TODO] Llamar a la API real: const data = await obtenerEntidades();
      const data: any[] = [];
      setEntidades(data);
    } catch (_) {
      setEntidades([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los registros", // [TODO] Personalizar
        confirmButtonColor: "#F39F23",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntidades();
  }, []);

  // Resetea la página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filtro1, estadoFilter, itemsPerPage]);

  // [TODO] Definir columnas de la tabla según campos reales
  // align: "left" | "center" | "right"  |  sortable: true si se puede ordenar
  const columnas: Column[] = [
    { key: "campo1", label: "Campo 1", sortable: true },            // [TODO]
    { key: "campo2", label: "Campo 2", sortable: true },            // [TODO]
    { key: "campo3", label: "Campo 3", align: "center", sortable: true }, // [TODO]
    { key: "status", label: "Estado", align: "center", sortable: true },  // [OPCIONAL]
    { key: "acciones", label: "Acciones", align: "center" },
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = entidades.filter((item) => {
      // [TODO] Ajustar campos de búsqueda de texto libre
      if (search) {
        const s = search.toLowerCase();
        const ok =
          item.campo1?.toLowerCase().includes(s) ||
          item.campo2?.toLowerCase().includes(s);
        if (!ok) return false;
      }

      // [OPCIONAL] Filtro por campo específico (ej: rol, categoría)
      if (filtro1 && item.campo3 !== filtro1) return false;

      // [OPCIONAL] Filtro por estado activo/inactivo (boolean status)
      if (estadoFilter !== "") {
        if (estadoFilter === "activo" && !item.status) return false;
        if (estadoFilter === "inactivo" && item.status) return false;
      }

      return true;
    });

    if (sortField && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: string | number = "";
        let bVal: string | number = "";
        switch (sortField) {
          // [TODO] Un case por cada SortField definido arriba
          case "campo1":
            aVal = a.campo1?.toLowerCase() ?? "";
            bVal = b.campo1?.toLowerCase() ?? "";
            break;
          case "campo2":
            aVal = a.campo2?.toLowerCase() ?? "";
            bVal = b.campo2?.toLowerCase() ?? "";
            break;
          case "campo3":
            aVal = a.campo3?.toLowerCase() ?? "";
            bVal = b.campo3?.toLowerCase() ?? "";
            break;
          // Ejemplo para campo boolean:
          // case "status": aVal = a.status ? 1 : 0; bVal = b.status ? 1 : 0; break;
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [entidades, search, filtro1, estadoFilter, sortField, sortDirection]);

  const totalItems = filteredAndSortedData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") { setSortDirection(null); setSortField(null); }
      else setSortDirection("asc");
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

  // [OPCIONAL] Eliminar si no hay acción de borrado
  const handleDelete = async (id: number) => {
    // [TODO] await confirmarEliminarEntidad(String(id), fetchEntidades);
    console.log("Eliminar", id);
  };

  // [OPCIONAL] Eliminar si la entidad no tiene toggle de estado
  const handleToggleStatus = async (item: any) => {
    const nuevoEstado = !item.status;
    const accion = nuevoEstado ? "activar" : "desactivar";
    // [TODO] Reemplazar "entidad" por el nombre real en los textos
    const result = await Swal.fire({
      title: `¿Estado: ${nuevoEstado ? "Activar" : "Desactivar"}?`,
      text: `¿Desea ${accion} el registro?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F39F23",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      // [TODO] await actualizarEstadoEntidad({ id: String(item.id), active: nuevoEstado });
      Swal.fire({
        icon: "success",
        title: nuevoEstado ? "Activado" : "Desactivado",
        timer: 1800,
        showConfirmButton: false,
      });
      fetchEntidades();
    } catch (_) {
      showError("Error", `No se pudo ${accion} el registro.`);
    }
  };

  const handleEditFromDetails = (item: any) => {
    setSelectedEntidad(null);
    setEditingEntidad(item);
  };

  if (loading) return <Loading message="Cargando registros..." />; // [TODO] Personalizar mensaje

  return (
    <div className="space-y-6">
      {/* === ENCABEZADO === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* [TODO] Cambiar título y subтítulo */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-1">
            Entidades
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión de entidades del sistema
          </p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />} onClick={() => setShowCreateModal(true)}>
          Nueva Entidad {/* [TODO] Cambiar texto */}
        </Button>
      </div>

      <Card>
        <div className="mb-6 space-y-4">
          {/* === FILTROS === */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por campo1, campo2..." {/* [TODO] Personalizar placeholder */}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* [OPCIONAL] Filtro adicional - duplicar bloque para cada filtro extra */}
            <div className="flex flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Campo3: {/* [TODO] Etiqueta del filtro */}
                </span>
                <SearchableSelect
                  value={filtro1}
                  onChange={setFiltro1}
                  options={[
                    { value: "", label: "Todos" },      // [TODO] Opciones reales
                    { value: "opcion1", label: "Opción 1" },
                    { value: "opcion2", label: "Opción 2" },
                  ]}
                  placeholder="Filtrar"
                  className="min-w-[150px]"
                />
              </div>

              {/* [OPCIONAL] Filtro de estado - eliminar si no aplica */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Estado:
                </span>
                <SearchableSelect
                  value={estadoFilter}
                  onChange={setEstadoFilter}
                  options={[
                    { value: "", label: "Todos" },
                    { value: "activo", label: "Activo" },
                    { value: "inactivo", label: "Inactivo" },
                  ]}
                  placeholder="Filtrar estado"
                  className="min-w-[130px]"
                />
              </div>
            </div>
          </div>

          {/* Items por página y contador */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar:</span>
              <SearchableSelect
                value={itemsPerPage.toString()}
                onChange={(v) => setItemsPerPage(Number(v))}
                options={[
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "15", label: "15" },
                  { value: "20", label: "20" },
                ]}
                placeholder="10"
                className="min-w-[80px]"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">registros por página</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {/* [TODO] Ajustar texto de plural */}
              Total: {totalItems} entidad{totalItems !== 1 ? "es" : ""}
            </div>
          </div>
        </div>

        {/* === TABLA === */}
        <Table
          columns={columnas}
          data={paginatedData}
          loading={loading}
          search={search}
          isFiltering={!!search || !!filtro1 || !!estadoFilter} {/* [TODO] incluir todos los filtros */}
          emptyMessage={(s) =>
            s
              ? `No se encontraron resultados para "${s}"`
              : "No hay registros" // [TODO] Personalizar
          }
          onSort={handleSort}
          getSortIcon={getSortIcon}
          pagination={{
            currentPage,
            setCurrentPage,
            itemsPerPage,
            totalItems,
            label: "entidades", // [TODO] Cambiar al plural correcto
          }}
          renderRow={(item) => (
            <>
              {/* [TODO] Una <td> por cada columna definida en "columnas" */}

              {/* Ejemplo campo de texto principal */}
              <td className="py-4 px-4 text-gray-900 dark:text-dark-text font-medium">
                {item.campo1}
              </td>

              {/* Ejemplo campo secundario */}
              <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                {item.campo2 || "-"}
              </td>

              {/* Ejemplo campo con badge (ej: roles, categorías) */}
              <td className="py-4 px-4 text-center">
                <span
                  className={
                    item.campo3 === "VALOR_A"
                      ? "inline-block px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }
                >
                  {/* [TODO] Texto del badge */}
                  {item.campo3}
                </span>
              </td>

              {/* [OPCIONAL] Columna de estado activo/inactivo */}
              <td className="py-4 px-4 text-center">
                <span
                  className={
                    item.status
                      ? "inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }
                >
                  {item.status ? "Activo" : "Inactivo"}
                </span>
              </td>

              {/* === BOTONES DE ACCIÓN === */}
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">

                  {/* Ver detalles */}
                  <button
                    onClick={() => setSelectedEntidad(item)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-blue-600"
                    title="Ver detalles"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  {/* Editar */}
                  <button
                    onClick={() => setEditingEntidad(item)}
                    className="p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors text-primary dark:text-dark-primary"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  {/* [OPCIONAL] Toggle de estado - eliminar si no aplica */}
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`p-2 hover:bg-primary-lighter dark:hover:bg-dark-bg rounded-lg transition-colors ${item.status ? "text-green-600" : "text-gray-400"}`}
                    title={item.status ? "Desactivar" : "Activar"}
                  >
                    {item.status
                      ? <ToggleRight className="w-5 h-5" />
                      : <ToggleLeft className="w-5 h-5" />}
                  </button>

                  {/* [OPCIONAL] Borrar - descomentear si se necesita */}
                  {/* <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-500"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button> */}

                </div>
              </td>
            </>
          )}
        />
      </Card>

      {/* === MODALES === */}
      {/* [TODO] Reemplazar EntidadDetalles / EntidadForm por los componentes reales */}

      {selectedEntidad && (
        // <EntidadDetalles
        //   entidad={selectedEntidad}
        //   onClose={() => setSelectedEntidad(null)}
        //   onEdit={handleEditFromDetails}
        // />
        <div /> // [TODO] Reemplazar por el componente de detalles real
      )}

      {editingEntidad && (
        // <EntidadForm
        //   entidad={editingEntidad}
        //   onClose={() => setEditingEntidad(null)}
        //   onSuccess={fetchEntidades}
        // />
        <div /> // [TODO] Reemplazar por el componente de formulario real
      )}

      {showCreateModal && (
        // <EntidadForm
        //   onClose={() => setShowCreateModal(false)}
        //   onSuccess={fetchEntidades}
        // />
        <div /> // [TODO] Reemplazar por el componente de formulario real
      )}
    </div>
  );
};
