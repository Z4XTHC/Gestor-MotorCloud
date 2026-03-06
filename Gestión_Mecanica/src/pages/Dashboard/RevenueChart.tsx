import React from 'react';
import { BarChart3 } from 'lucide-react';

const mockChartData = [
  { week: 'Sem 1', revenue: 580000, repairs: 18 },
  { week: 'Sem 2', revenue: 720000, repairs: 22 },
  { week: 'Sem 3', revenue: 650000, repairs: 20 },
  { week: 'Sem 4', revenue: 890000, repairs: 28 }
];

export function RevenueChart() {
  const maxRevenue = Math.max(...mockChartData.map(d => d.revenue));

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Ingresos por Semana
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Últimas 4 semanas
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mockChartData.map((data, index) => {
          const percentage = (data.revenue / maxRevenue) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  {data.week}
                </span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    ${data.revenue.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-2">
                    {data.repairs} reparaciones
                  </span>
                </div>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              ${mockChartData.reduce((acc, data) => acc + data.revenue, 0).toLocaleString()}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Total del Mes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {mockChartData.reduce((acc, data) => acc + data.repairs, 0)}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Reparaciones</p>
          </div>
        </div>
      </div>
    </div>
  );
}