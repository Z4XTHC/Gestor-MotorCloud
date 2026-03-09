import { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Header } from "./components/Layout/Header";
import { Sidebar } from "./components/Layout/Sidebar";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Inventory } from "./pages/Inventario/Inventory";
import { Orders } from "./pages/Ordenes/Orders";
import { Clients } from "./pages/Clientes/Clientes";
import { VehiculosList } from "./pages/Vehiculos/Vehiculos";
import { Login } from "./pages/Auth/Login";
import { AcercaDe } from "./pages/AcercaDe";
import { Calendario } from "./pages/Calendario/Calendario";
import { Config } from "./pages/Config/Config";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mientras verifica la sesión con el servidor
  if (isLoading) {
    return (
      <div className="h-screen bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin w-8 h-8 text-primary-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "calendar":
        return <Calendario />;
      case "inventory":
        return <Inventory />;
      case "orders":
        return <Orders />;
      case "clients":
        return <Clients />;
      case "vehiculos":
        return <VehiculosList />;
      case "reports":
        return (
          <main className="p-4 lg:p-6" role="main">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Reportes
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Módulo de reportes en desarrollo...
            </p>
          </main>
        );
      case "settings":
        return <Config />;
      case "about":
        return <AcercaDe />;
      default:
        return <Dashboard />;
    }
  };

  return (
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

          <div className="flex-1 overflow-y-auto">{renderView()}</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
