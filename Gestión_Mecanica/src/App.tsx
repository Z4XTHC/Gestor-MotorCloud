import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Inventory } from './components/Inventory/Inventory';
import { Orders } from './components/Orders/Orders';
import { Clients } from './components/Clients/Clients';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'orders':
        return <Orders />;
      case 'clients':
        return <Clients />;
      case 'reports':
        return (
          <main className="p-4 lg:p-6" role="main">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reportes</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Módulo de reportes en desarrollo...
            </p>
          </main>
        );
      case 'settings':
        return (
          <main className="p-4 lg:p-6" role="main">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Configuración</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Módulo de configuración en desarrollo...
            </p>
          </main>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300 overflow-hidden">
        <div className="flex h-full">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeView={activeView}
            onViewChange={setActiveView}
          />
          
          <div className="flex-1 flex flex-col">
            <Header
              onMenuToggle={() => setSidebarOpen(true)}
              isSidebarOpen={sidebarOpen}
            />
            
            <div className="flex-1 overflow-y-auto">
              {renderView()}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;