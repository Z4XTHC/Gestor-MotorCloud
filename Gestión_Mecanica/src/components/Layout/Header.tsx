import React from 'react';
import { Menu, Sun, Moon, Bell, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 h-14 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">MTS Competición</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-tight">Gestión de Taller</p>
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-2" role="navigation" aria-label="User actions">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          )}
        </button>

        <button
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary-500 rounded-full"></span>
        </button>

        <button
          className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="User profile"
          title="Profile"
        >
          <User className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
      </nav>
    </header>
  );
}