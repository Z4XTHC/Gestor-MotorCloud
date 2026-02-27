import React from 'react';
import { Car, ClipboardCheck, DollarSign, TrendingUp } from 'lucide-react';
import { KPICard } from './KPICard';
import { StockAlert } from './StockAlert';
import { RevenueChart } from './RevenueChart';

const mockStockData = [
  { id: '1', name: 'Filtro de Aceite', current: 2, minimum: 5, status: 'critical' as const },
  { id: '2', name: 'Pastillas de Freno', current: 8, minimum: 10, status: 'low' as const },
  { id: '3', name: 'Bujías', current: 4, minimum: 15, status: 'critical' as const },
  { id: '4', name: 'Aceite Motor 5W30', current: 12, minimum: 20, status: 'low' as const }
];

export function Dashboard() {
  return (
    <main className="p-4 lg:p-6 space-y-4 lg:space-y-6" role="main" aria-label="Dashboard principal">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Vista general del taller MTS Competición
        </p>
      </div>

      {/* KPI Cards */}
      <section aria-label="Indicadores clave de rendimiento">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <KPICard
            title="Vehículos en Taller"
            value={12}
            subtitle="3 en reparación crítica"
            icon={Car}
            trend={{ value: 15, direction: 'up' }}
            color="primary"
          />
          <KPICard
            title="Órdenes Listas"
            value={5}
            subtitle="Para retirar hoy"
            icon={ClipboardCheck}
            trend={{ value: 8, direction: 'down' }}
            color="success"
          />
          <KPICard
            title="Ingresos del Mes"
            value="$2,450,000"
            subtitle="Meta: $2,800,000"
            icon={DollarSign}
            trend={{ value: 12, direction: 'up' }}
            color="primary"
          />
          <KPICard
            title="Eficiencia"
            value="87%"
            subtitle="Tiempo promedio de reparación"
            icon={TrendingUp}
            trend={{ value: 5, direction: 'up' }}
            color="success"
          />
        </div>
      </section>

      {/* Charts and Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6" aria-label="Gráficos y alertas">
        <RevenueChart />
        <StockAlert items={mockStockData} />
      </section>
    </main>
  );
}