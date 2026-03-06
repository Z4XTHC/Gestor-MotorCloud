import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  current: number;
  minimum: number;
  status: 'critical' | 'low' | 'ok';
}

interface StockAlertProps {
  items: StockItem[];
}

export function StockAlert({ items }: StockAlertProps) {
  const criticalItems = items.filter(item => item.status === 'critical');
  const lowItems = items.filter(item => item.status === 'low');

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Alertas de Stock
        </h3>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {criticalItems.length === 0 && lowItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400">
              No hay alertas de stock críticas
            </p>
          </div>
        ) : (
          <>
            {criticalItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-error-50 dark:bg-error-900/20 rounded-lg border border-error-200 dark:border-error-800"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-error-900 dark:text-error-100">
                    {item.name}
                  </h4>
                  <p className="text-sm text-error-600 dark:text-error-400">
                    Stock crítico: {item.current} unidades
                  </p>
                </div>
                <button className="px-3 py-1 bg-error-600 text-white rounded-lg text-sm font-medium hover:bg-error-700 transition-colors">
                  Reponer
                </button>
              </div>
            ))}

            {lowItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-warning-900 dark:text-warning-100">
                    {item.name}
                  </h4>
                  <p className="text-sm text-warning-600 dark:text-warning-400">
                    Stock bajo: {item.current} unidades
                  </p>
                </div>
                <button className="px-3 py-1 bg-warning-600 text-white rounded-lg text-sm font-medium hover:bg-warning-700 transition-colors">
                  Reponer
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}