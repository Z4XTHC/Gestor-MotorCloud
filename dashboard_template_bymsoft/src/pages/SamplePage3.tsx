import React from "react";

const SamplePage3: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Página de Ejemplo 3 - Formularios
      </h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Formulario de Ejemplo</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ingrese su nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ingrese su correo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Seleccione una opción</option>
              <option value="opcion1">Opción 1</option>
              <option value="opcion2">Opción 2</option>
              <option value="opcion3">Opción 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="Ingrese una descripción"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SamplePage3;
