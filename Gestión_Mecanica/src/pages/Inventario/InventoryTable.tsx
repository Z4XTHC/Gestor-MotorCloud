import React from 'react';
import { Package, AlertTriangle, RotateCcw, CreditCard as Edit } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
  status: 'ok' | 'low' | 'critical';
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const getStatusBadge = (status: string, stock: number) => {
    switch (status) {
      case 'ok':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-200 text-xs font-medium rounded-full">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            Stock OK
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-200 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Stock Bajo
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-200 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            {stock === 0 ? 'Sin Stock' : 'Stock Crítico'}
          </span>
        );
      default:
        return null;
    }
  };

  const handleRestock = (itemName: string) => {
    alert(`Función de reposición para: ${itemName}\nEsta función estaría integrada con el sistema de proveedores.`);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Tabla de inventario">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Repuesto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Categoría
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Proveedor
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No se encontraron repuestos que coincidan con los criterios de búsqueda
                  </p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-white">{item.name}</h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark:text-white">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {item.stock} unidades
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        Mínimo: {item.minStock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status, item.stock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      ${item.price.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-neutral-900 dark:text-white">{item.supplier}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRestock(item.name)}
                        className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        aria-label={`Reponer stock de ${item.name}`}
                        title="Reponer Stock"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                        aria-label={`Editar ${item.name}`}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}