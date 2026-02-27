import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BurbujaChat } from "./BurbujaChat";
import { InstallPrompt } from "../InstallPrompt";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-dark-bg">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        collapsed={sidebarCollapsed}
      />
      <main
        className={`pt-16 pb-20 lg:pb-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
      <BurbujaChat />
      <InstallPrompt variant="modal" delay={5000} />
    </div>
  );
};
