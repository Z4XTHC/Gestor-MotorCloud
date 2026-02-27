import React, { useState } from 'react';
import { Search, Filter, Package, Plus } from 'lucide-react';
import { InventoryTable } from './InventoryTable';

const mockInventory = [
  { id: '1', name: 'Filtro de Aceite', category: 'Filtros', stock: 25, minStock: 10, price: 8500, supplier: 'AutoParts SA', status: 'ok' as const },
  { id: '2', name: 'Pastillas de Freno', category: 'Frenos', stock: 8, minStock: 15, price: 45000, supplier: 'BrakeMax', status: 'low' as const },
  { id: '3', name: 'Bujías NGK', category: 'Encendido', stock: 2, minStock: 20, price: 12000, supplier: 'NGK Chile', status: 'critical' as const },
  { id: '4', name: 'Aceite Motor 5W30', category: 'Lubricantes', stock: 50, minStock: 25, price: 18000, supplier: 'Shell', status: 'ok' as const },
  { id: '5', name: 'Amortiguador Delantero', category: 'Suspensión', stock: 6, minStock: 8, price: 85000, supplier: 'Monroe', status: 'low' as const },
  { id: '6', name: 'Batería 12V', category: 'Eléctrico', stock: 0, minStock: 5, price: 95000, supplier: 'Bosch', status: 'critical' as const }
];

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', ...Array.from(new Set(mockInventory.map(item => item.category)))];
  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'ok', label: 'Stock OK' },
    { value: 'low', label: 'Stock Bajo' },
    { value: 'critical', label: 'Stock Crítico' }
  ];

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <main className="p-4 lg:p-6" role="main" aria-label="Gestión de inventario">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Gestión de Inventario
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Control de repuestos y suministros del taller
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4" />
            Agregar Repuesto
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar repuestos, categorías o proveedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Buscar en inventario"
            />
          </div>

          <div className="flex gap-3 lg:gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Filtrar por categoría"
            >
              <option value="all">Todas las categorías</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Filtrar por estado de stock"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary-500" />
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{mockInventory.length}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Repuestos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success-100 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {mockInventory.filter(item => item.status === 'ok').length}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Stock OK</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-warning-100 dark:bg-warning-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {mockInventory.filter(item => item.status === 'low').length}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Stock Bajo</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-error-100 dark:bg-error-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-error-600 dark:text-error-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {mockInventory.filter(item => item.status === 'critical').length}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Stock Crítico</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InventoryTable items={filteredInventory} />
    </main>
  );
}