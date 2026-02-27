import React, { useState } from 'react';
import { Search, User, Plus, Phone, Car, Calendar } from 'lucide-react';

const mockClients = [
  {
    id: '1',
    name: 'Juan Pérez',
    phone: '+56912345678',
    email: 'juan.perez@email.com',
    vehicles: [
      { plate: 'ABC-123', model: 'Toyota Corolla 2020', year: 2020 }
    ],
    lastService: new Date('2024-01-10'),
    totalOrders: 8,
    totalSpent: 850000,
    history: [
      { id: 'OT-001', date: new Date('2024-01-10'), service: 'Mantención 20,000 km', amount: 120000 },
      { id: 'OT-015', date: new Date('2023-12-05'), service: 'Cambio de frenos', amount: 180000 },
      { id: 'OT-008', date: new Date('2023-10-20'), service: 'Alineación y balanceo', amount: 45000 }
    ]
  },
  {
    id: '2',
    name: 'María González',
    phone: '+56987654321',
    email: 'maria.gonzalez@email.com',
    vehicles: [
      { plate: 'XYZ-789', model: 'Honda Civic 2019', year: 2019 },
      { plate: 'DEF-456', model: 'Honda CR-V 2021', year: 2021 }
    ],
    lastService: new Date('2024-01-08'),
    totalOrders: 12,
    totalSpent: 1250000,
    history: [
      { id: 'OT-002', date: new Date('2024-01-08'), service: 'Mantención preventiva', amount: 95000 },
      { id: 'OT-012', date: new Date('2023-11-15'), service: 'Cambio de aceite', amount: 35000 },
      { id: 'OT-005', date: new Date('2023-09-30'), service: 'Revisión técnica', amount: 25000 }
    ]
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    phone: '+56956789012',
    email: 'carlos.rodriguez@email.com',
    vehicles: [
      { plate: 'GHI-789', model: 'Ford Focus 2018', year: 2018 }
    ],
    lastService: new Date('2023-12-28'),
    totalOrders: 5,
    totalSpent: 420000,
    history: [
      { id: 'OT-018', date: new Date('2023-12-28'), service: 'Reparación motor', amount: 250000 },
      { id: 'OT-010', date: new Date('2023-11-10'), service: 'Cambio de batería', amount: 95000 }
    ]
  }
];

export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.vehicles.some(vehicle => 
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const selectedClientData = selectedClient ? mockClients.find(c => c.id === selectedClient) : null;

  return (
    <main className="p-4 lg:p-6" role="main" aria-label="Gestión de clientes">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Gestión de Clientes
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Base de datos de clientes y historial de servicios
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          Agregar Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Client List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-soft">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  aria-label="Buscar clientes"
                />
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <div className="p-8 text-center">
                  <User className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No se encontraron clientes
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredClients.map(client => (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClient(client.id)}
                      className={`w-full p-3 text-left rounded-lg transition-colors ${
                        selectedClient === client.id
                          ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                            {client.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <span>{client.vehicles.length} vehículo{client.vehicles.length > 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{client.totalOrders} órdenes</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-2">
          {selectedClientData ? (
            <div className="space-y-4 lg:space-y-6">
              {/* Client Header */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      {selectedClientData.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {selectedClientData.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          Último servicio: {selectedClientData.lastService.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-neutral-600 dark:text-neutral-400">Total gastado: </span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          ${selectedClientData.totalSpent.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicles */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehículos Registrados
                </h3>
                <div className="space-y-3">
                  {selectedClientData.vehicles.map((vehicle, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        <Car className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-white">
                          {vehicle.model}
                        </h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Patente: {vehicle.plate} • Año: {vehicle.year}
                        </p>
                      </div>
                      <button className="px-3 py-1 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                        Nueva OT
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service History */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Historial de Servicios
                </h3>
                <div className="space-y-3">
                  {selectedClientData.history.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-neutral-900 dark:text-white">
                            {service.id}
                          </span>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            {service.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {service.service}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          ${service.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      Total de servicios: {selectedClientData.totalOrders}
                    </span>
                    <span className="font-semibold text-lg text-primary-600 dark:text-primary-400">
                      ${selectedClientData.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-soft">
              <div className="p-12 text-center">
                <User className="w-16 h-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                  Selecciona un Cliente
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Elige un cliente de la lista para ver sus detalles e historial de servicios
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}