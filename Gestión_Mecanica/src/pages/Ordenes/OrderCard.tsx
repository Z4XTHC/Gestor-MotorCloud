import React, { useState } from 'react';
import { Calendar, User, Phone, Car, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { WhatsAppModal } from './WhatsAppModal';

interface OrderCardProps {
  order: {
    id: string;
    vehicleInfo: {
      plate: string;
      model: string;
      client: string;
      phone: string;
    };
    status: 'pending' | 'in_progress' | 'completed' | 'ready_for_pickup';
    priority: 'low' | 'medium' | 'high';
    description: string;
    createdAt: Date;
    estimatedCompletion: Date;
    assignedTechnician: string;
    parts: Array<{ id: string; name: string; quantity: number; price: number }>;
    timeline: Array<{
      step: string;
      completed: boolean;
      date: Date | null;
    }>;
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200', label: 'Pendiente' },
      in_progress: { color: 'bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200', label: 'En Progreso' },
      completed: { color: 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-200', label: 'Completado' },
      ready_for_pickup: { color: 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-200', label: 'Listo para retirar' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-error-500';
      case 'medium': return 'border-l-warning-500';
      case 'low': return 'border-l-success-500';
      default: return 'border-l-neutral-300';
    }
  };

  const completedSteps = order.timeline.filter(step => step.completed).length;
  const totalSteps = order.timeline.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <article className={`bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-soft hover:shadow-medium transition-shadow duration-300 border-l-4 ${getPriorityColor(order.priority)}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{order.id}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{order.description}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Vehicle and Client Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">{order.vehicleInfo.plate}</span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 ml-6">{order.vehicleInfo.model}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">{order.vehicleInfo.client}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{order.vehicleInfo.phone}</span>
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Progreso</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{completedSteps}/{totalSteps}</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-2 space-y-1">
            {order.timeline.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <CheckCircle className={`w-3 h-3 ${step.completed ? 'text-success-500' : 'text-neutral-400 dark:text-neutral-500'}`} />
                <span className={`${step.completed ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {step.step}
                  {step.date && (
                    <span className="ml-1 text-neutral-400 dark:text-neutral-500">
                      ({step.date.toLocaleDateString()})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dates and Technician */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <span className="text-neutral-500 dark:text-neutral-400">Ingreso:</span>
            </div>
            <p className="text-neutral-900 dark:text-white ml-6">{order.createdAt.toLocaleDateString()}</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <span className="text-neutral-500 dark:text-neutral-400">Estimado:</span>
            </div>
            <p className="text-neutral-900 dark:text-white ml-6">{order.estimatedCompletion.toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Técnico asignado:</span>
          </div>
          <p className="text-sm font-medium text-neutral-900 dark:text-white ml-6">{order.assignedTechnician}</p>
        </div>

        {/* Parts Summary */}
        {order.parts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Repuestos utilizados:</h4>
            <div className="space-y-1">
              {order.parts.slice(0, 2).map(part => (
                <div key={part.id} className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {part.quantity}x {part.name}
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    ${(part.quantity * part.price).toLocaleString()}
                  </span>
                </div>
              ))}
              {order.parts.length > 2 && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  +{order.parts.length - 2} repuestos más
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          {order.status === 'completed' && (
            <button
              onClick={() => setShowWhatsApp(true)}
              className="flex items-center gap-2 px-3 py-2 bg-success-600 text-white rounded-lg text-sm font-medium hover:bg-success-700 transition-colors"
              aria-label="Notificar por WhatsApp que está listo para retirar"
            >
              <MessageSquare className="w-4 h-4" />
              Listo para retirar
            </button>
          )}
          <button className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
            Ver detalles
          </button>
        </div>
      </div>

      {showWhatsApp && (
        <WhatsAppModal
          order={order}
          onClose={() => setShowWhatsApp(false)}
        />
      )}
    </article>
  );
}