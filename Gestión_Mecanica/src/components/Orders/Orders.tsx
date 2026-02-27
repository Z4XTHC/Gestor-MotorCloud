import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { OrderCard } from './OrderCard';
import { OrderForm } from './OrderForm';

const mockOrders = [
  {
    id: 'OT-001',
    vehicleInfo: {
      plate: 'ABC-123',
      model: 'Toyota Corolla 2020',
      client: 'Juan Pérez',
      phone: '+56912345678'
    },
    status: 'in_progress' as const,
    priority: 'high' as const,
    description: 'Cambio de frenos y revisión general',
    createdAt: new Date('2024-01-15'),
    estimatedCompletion: new Date('2024-01-17'),
    assignedTechnician: 'Carlos Méndez',
    parts: [
      { id: '1', name: 'Pastillas de freno', quantity: 4, price: 45000 },
      { id: '2', name: 'Líquido de frenos', quantity: 1, price: 8500 }
    ],
    timeline: [
      { step: 'Ingreso', completed: true, date: new Date('2024-01-15T09:00') },
      { step: 'Diagnóstico', completed: true, date: new Date('2024-01-15T10:30') },
      { step: 'Reparación', completed: false, date: null },
      { step: 'Control de Calidad', completed: false, date: null },
      { step: 'Listo para entrega', completed: false, date: null }
    ]
  },
  {
    id: 'OT-002',
    vehicleInfo: {
      plate: 'XYZ-789',
      model: 'Honda Civic 2019',
      client: 'María González',
      phone: '+56987654321'
    },
    status: 'completed' as const,
    priority: 'medium' as const,
    description: 'Mantención preventiva 20,000 km',
    createdAt: new Date('2024-01-14'),
    estimatedCompletion: new Date('2024-01-16'),
    assignedTechnician: 'Roberto Silva',
    parts: [
      { id: '3', name: 'Filtro de aceite', quantity: 1, price: 8500 },
      { id: '4', name: 'Aceite motor 5W30', quantity: 4, price: 18000 }
    ],
    timeline: [
      { step: 'Ingreso', completed: true, date: new Date('2024-01-14T08:00') },
      { step: 'Diagnóstico', completed: true, date: new Date('2024-01-14T09:15') },
      { step: 'Reparación', completed: true, date: new Date('2024-01-14T14:30') },
      { step: 'Control de Calidad', completed: true, date: new Date('2024-01-14T16:00') },
      { step: 'Listo para entrega', completed: true, date: new Date('2024-01-14T16:30') }
    ]
  }
];

export function Orders() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'ready_for_pickup', label: 'Listo para retirar' }
  ];

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicleInfo.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicleInfo.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicleInfo.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="p-4 lg:p-6" role="main" aria-label="Gestión de órdenes de trabajo">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Órdenes de Trabajo
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Gestión de reparaciones y servicios del taller
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Orden
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-4 lg:mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por OT, patente, cliente o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Buscar órdenes de trabajo"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          aria-label="Filtrar por estado"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
              No se encontraron órdenes que coincidan con los criterios de búsqueda
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>

      {/* Order Form Modal */}
      {showForm && (
        <OrderForm onClose={() => setShowForm(false)} />
      )}
    </main>
  );
}