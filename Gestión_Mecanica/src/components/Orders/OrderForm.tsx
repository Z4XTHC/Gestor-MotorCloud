import React, { useState } from 'react';
import { X, Car, User, Calendar, Plus, Trash2 } from 'lucide-react';

interface OrderFormProps {
  onClose: () => void;
}

const mockParts = [
  { id: '1', name: 'Filtro de Aceite', price: 8500, stock: 25 },
  { id: '2', name: 'Pastillas de Freno', price: 45000, stock: 8 },
  { id: '3', name: 'Bujías NGK', price: 12000, stock: 2 },
  { id: '4', name: 'Aceite Motor 5W30', price: 18000, stock: 50 },
  { id: '5', name: 'Amortiguador Delantero', price: 85000, stock: 6 }
];

export function OrderForm({ onClose }: OrderFormProps) {
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    client: '',
    phone: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedDays: 3,
    technician: 'Carlos Méndez'
  });

  const [selectedParts, setSelectedParts] = useState<Array<{id: string; name: string; quantity: number; price: number; stock: number}>>([]);

  const handleAddPart = (part: typeof mockParts[0]) => {
    const existing = selectedParts.find(p => p.id === part.id);
    if (existing) {
      if (existing.quantity < part.stock) {
        setSelectedParts(prev => 
          prev.map(p => p.id === part.id ? {...p, quantity: p.quantity + 1} : p)
        );
      }
    } else {
      setSelectedParts(prev => [...prev, {...part, quantity: 1}]);
    }
  };

  const handleRemovePart = (partId: string) => {
    setSelectedParts(prev => prev.filter(p => p.id !== partId));
  };

  const handleQuantityChange = (partId: string, newQuantity: number) => {
    const part = mockParts.find(p => p.id === partId);
    if (part && newQuantity > 0 && newQuantity <= part.stock) {
      setSelectedParts(prev => 
        prev.map(p => p.id === partId ? {...p, quantity: newQuantity} : p)
      );
    }
  };

  const totalCost = selectedParts.reduce((sum, part) => sum + (part.price * part.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Orden de trabajo creada exitosamente!\n\nEn una implementación real, esto guardaría la información en la base de datos.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-strong">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <Car className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Nueva Orden de Trabajo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Vehicle Information */}
            <section>
              <h4 className="text-md font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Información del Vehículo
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Patente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.plate}
                    onChange={(e) => setFormData(prev => ({...prev, plate: e.target.value.toUpperCase()}))}
                    placeholder="ABC-123"
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Modelo del Vehículo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
                    placeholder="Toyota Corolla 2020"
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Client Information */}
            <section>
              <h4 className="text-md font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Información del Cliente
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({...prev, client: e.target.value}))}
                    placeholder="Juan Pérez"
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    placeholder="+56912345678"
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Service Details */}
            <section>
              <h4 className="text-md font-semibold text-neutral-900 dark:text-white mb-4">
                Detalles del Servicio
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Descripción del Trabajo *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe el trabajo a realizar..."
                    className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Prioridad
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({...prev, priority: e.target.value as 'low' | 'medium' | 'high'}))}
                      className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Días estimados
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={formData.estimatedDays}
                      onChange={(e) => setFormData(prev => ({...prev, estimatedDays: parseInt(e.target.value)}))}
                      className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Técnico asignado
                    </label>
                    <select
                      value={formData.technician}
                      onChange={(e) => setFormData(prev => ({...prev, technician: e.target.value}))}
                      className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Carlos Méndez">Carlos Méndez</option>
                      <option value="Roberto Silva">Roberto Silva</option>
                      <option value="Ana Torres">Ana Torres</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Parts Selection */}
            <section>
              <h4 className="text-md font-semibold text-neutral-900 dark:text-white mb-4">
                Selección de Repuestos
              </h4>
              
              {/* Available Parts */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Repuestos Disponibles:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {mockParts.map(part => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => handleAddPart(part)}
                      disabled={part.stock === 0}
                      className="text-left p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white text-sm">{part.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">${part.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">Stock: {part.stock}</p>
                          <Plus className="w-4 h-4 text-primary-500 ml-auto" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Parts */}
              {selectedParts.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Repuestos Seleccionados:</h5>
                  <div className="space-y-2 mb-4">
                    {selectedParts.map(part => (
                      <div key={part.id} className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900 dark:text-white text-sm">{part.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">${part.price.toLocaleString()} c/u</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={part.stock}
                            value={part.quantity}
                            onChange={(e) => handleQuantityChange(part.id, parseInt(e.target.value))}
                            className="w-16 p-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 text-center"
                          />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            ${(part.price * part.quantity).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePart(part.id)}
                            className="p-1 text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Total en repuestos:</p>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      ${totalCost.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="flex gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Crear Orden de Trabajo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}