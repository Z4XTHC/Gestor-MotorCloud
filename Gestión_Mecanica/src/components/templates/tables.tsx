// =============================================================
// PLANTILLA: Lista con tabla paginada, filtros y ordenamiento
// =============================================================
// PASOS PARA ADAPTAR:
//  1. Reemplazar "Entidad" / "entidades" por el nombre real (ej: Cliente, Producto)
//  2. Reemplazar "EntidadType" por el tipo TypeScript de tu entidad
//  3. Ajustar los imports de API (obtenerXxx, actualizarEstadoXxx)
//  4. Definir los campos de SortField segun los campos de tu entidad
//  5. Actualizar "columnas" con las columnas reales de la tabla
//  6. Actualizar el bloque de filtros segun los campos filtrables
//  7. Actualizar filteredAndSortedData con la logica de filtro correcta
//  8. Actualizar renderRow con las celdas correspondientes a tus campos
//  9. Ajustar el toggle de estado si tu entidad no lo necesita (puedes eliminarlo)
// 10. Importar los componentes de detalle/form/confirm propios de la entidad
// =============================================================

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ToggleLeft,  // [OPCIONAL] Solo si la entidad tiene toggle de estado
  ToggleRight, // [OPCIONAL] Solo si la entidad tiene toggle de estado
} from "lucide-react";
import Swal from "sweetalert2";
import { Column, Table } from "../common/Table";
import { TableSkeleton } from "../common/TableSkeleton";
import { Button } from "../common/Button";
import { SearchInput } from "../common/SearchInput";
import { SearchableSelect } from "../common/SearchableSelect";
import { Modal } from "../common/Modal";
import { showError } from "../common/SweetAlert";

// [TODO] Reemplazar por el tipo real de tu entidad
// import { EntidadType } from "../../types/entidad";

// [TODO] Reemplazar por las funciones de API correspondientes
// import { obtenerEntidades, actualizarEstadoEntidad } from "../../api/entidadApi";

// [TODO] Importar los componentes propios de la entidad
// import { EntidadDetalles } from "./EntidadDetalles";
// import { EntidadForm } from "./EntidadForm";
// import { confirmarEliminarEntidad } from "./EntidadConfirm";

// [TODO] Definir los campos por los que se puede ordenar
type SortField = "campo1" | "campo2" | "campo3";
type SortDirection = "asc" | "desc" | null;

// [TODO] Renombrar el componente: EntidadList
export const EntidadList = () => {
  const [entidades, setEntidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // [OPCIONAL] Filtros adicionales segun campos de la entidad
  const [filtro1, setFiltro1] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const [selectedEntidad, setSelectedEntidad] = useState<any | null>(null);
  const [editingEntidad, setEditingEntidad] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField | null>("campo1");
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

  useEffect(() => { fetchEntidades(); }, []);

  // Resetea la pagina al cambiar filtros
  useEffect(() => { setCurrentPage(1); }, [search, filtro1, estadoFilter, itemsPerPage]);

  // [TODO] Definir columnas de la tabla segun campos reales
  const columnas: Column[] = [
    { key: "campo1", label: "Campo 1", sortable: true },
    { key: "campo2", label: "Campo 2", sortable: true },
    { key: "campo3", label: "Campo 3", align: "center", sortable: true },
    { key: "status", label: "Estado", align: "center", sortable: true }, // [OPCIONAL]
    { key: "acciones", label: "Acciones", align: "right" },
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = entidades.filter((item) => {
      if (search) {
        const s = search.toLowerCase();
        const ok =
          item.campo1?.toLowerCase().includes(s) ||
          item.campo2?.toLowerCase().includes(s);
        if (!ok) return false;
      }
      if (filtro1 && item.campo3 !== filtro1) return false;
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
          case "campo1": aVal = a.campo1?.toLowerCase() ?? ""; bVal = b.campo1?.toLowerCase() ?? ""; break;
          case "campo2": aVal = a.campo2?.toLowerCase() ?? ""; bVal = b.campo2?.toLowerCase() ?? ""; break;
          case "campo3": aVal = a.campo3?.toLowerCase() ?? ""; bVal = b.campo3?.toLowerCase() ?? ""; break;
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
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    if (sortDirection === "asc") return <ArrowUp className="w-4 h-4 ml-1" />;
    if (sortDirection === "desc") return <ArrowDown className="w-4 h-4 ml-1" />;
    return <ArrowUpDown className="w-4 h-4 ml-1" />;
  };

  // [OPCIONAL] Eliminar si no hay accion de borrado
  const handleDelete = async (id: number) => {
    // [TODO] await confirmarEliminarEntidad(String(id), fetchEntidades);
    console.log("Eliminar", id);
  };

  // [OPCIONAL] Eliminar si la entidad no tiene toggle de estado
  const handleToggleStatus = async (item: any) => {
    const nuevoEstado = !item.status;
    const accion = nuevoEstado ? "activar" : "desactivar";
    const result = await Swal.fire({
      title: `Estado: ${nuevoEstado ? "Activar" : "Desactivar"}?`,
      text: `Desea ${accion} el registro?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F39F23",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Si, ${accion}`,
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      // [TODO] await actualizarEstadoEntidad({ id: String(item.id), active: nuevoEstado });
      Swal.fire({ icon: "success", title: nuevoEstado ? "Activado" : "Desactivado", timer: 1800, showConfirmButton: false });
      fetchEntidades();
    } catch (_) {
      showError("Error", `No se pudo ${accion} el registro.`);
    }
  };

  const handleEditFromDetails = (item: any) => {
    setSelectedEntidad(null);
    setEditingEntidad(item);
  };

  // [OPCIONAL] Opciones de filtros
  // const filtro1Options = [
  //   { value: "", label: "Todos" },
  //   { value: "VALOR_A", label: "Opcion A" },
  //   { value: "VALOR_B", label: "Opcion B" },
  // ];
  const estadoOptions = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
  ];
  const itemsPerPageOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
    { value: "20", label: "20" },
  ];

  return (
    <main className="p-4 lg:p-6" role="main">

      {/* === ENCABEZADO === */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          {/* [TODO] Cambiar titulo y subtitulo */}
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Entidades
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Gestion de entidades del sistema
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          Nueva Entidad {/* [TODO] Cambiar texto */}
        </Button>
      </div>

      {/* === FILTROS === */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar..." // [TODO] Personalizar
          className="flex-1"
        />
        <div className="flex gap-3">
          {/* [OPCIONAL] Filtro por campo especifico */}
          {/* <SearchableSelect
            value={filtro1}
            onChange={setFiltro1}
            options={filtro1Options}
            placeholder="Filtrar por campo..."
            className="w-44"
          /> */}

          {/* [OPCIONAL] Filtro por estado */}
          <SearchableSelect
            value={estadoFilter}
            onChange={setEstadoFilter}
            options={estadoOptions}
            placeholder="Todos los estados"
            className="w-44"
          />

          {/* Items por pagina */}
          <SearchableSelect
            value={String(itemsPerPage)}
            onChange={(v) => setItemsPerPage(Number(v))}
            options={itemsPerPageOptions}
            placeholder="10"
            className="w-20"
          />
        </div>
      </div>

      {/* Contador de resultados */}
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        {totalItems} {totalItems === 1 ? "registro" : "registros"} encontrados
        {/* [TODO] Cambiar "registro" al plural de la entidad */}
      </p>

      {/* === TABLA === */}
      {loading ? (
        <TableSkeleton columns={columnas.length} rows={itemsPerPage} />
      ) : (
        <Table
          columns={columnas}
          data={paginatedData}
          loading={false}
          search={search}
          isFiltering={!!search || !!filtro1 || !!estadoFilter}
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

              {/* [OPCIONAL] Campo con icono (columna principal) */}
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center shrink-0">
                    <IconX className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{item.campo1}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">ID: {item.id}</p>
                  </div>
                </div>
              </td> */}

              {/* Campo de texto simple */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">{item.campo1}</span>
              </td>

              {/* Campo secundario */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">{item.campo2 || "-"}</span>
              </td>

              {/* Badge de tipo / categoria */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className={
                  item.campo3 === "VALOR_A"
                    ? "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                    : "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                }>
                  {item.campo3 === "VALOR_A" ? "Tipo A" : "Tipo B"}
                </span>
              </td>

              {/* [OPCIONAL] Estado activo/inactivo con toggle */}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    item.status
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200"
                  }`}
                  title={item.status ? "Desactivar" : "Activar"}
                >
                  {item.status ? (
                    <ToggleRight className="w-3.5 h-3.5" />
                  ) : (
                    <ToggleLeft className="w-3.5 h-3.5" />
                  )}
                  {item.status ? "Activo" : "Inactivo"}
                </button>
              </td>

              {/* === BOTONES DE ACCION === */}
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => setSelectedEntidad(item)}
                    className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingEntidad(item)}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </>
          )}
        />
      )}

      {/* === MODALES === */}
      {/* [TODO] Reemplazar los JSX comentados por los componentes reales */}

      {/* Detalles */}
      {/* <EntidadDetalles
        entidad={selectedEntidad}
        onClose={() => setSelectedEntidad(null)}
        onEdit={handleEditFromDetails}
      /> */}

      {/* Editar */}
      <Modal
        isOpen={!!editingEntidad}
        onClose={() => setEditingEntidad(null)}
        title="Editar Entidad"
        maxWidth="lg"
        noPadding
      >
        {/* [TODO] <EntidadForm entidad={editingEntidad} onClose={() => setEditingEntidad(null)} onSuccess={fetchEntidades} /> */}
      </Modal>

      {/* Crear */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nueva Entidad"
        maxWidth="lg"
        noPadding
      >
        {/* [TODO] <EntidadForm onClose={() => setShowCreateModal(false)} onSuccess={fetchEntidades} /> */}
      </Modal>

    </main>
  );
};
