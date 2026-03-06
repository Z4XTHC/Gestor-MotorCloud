import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const Card = ({
  children,
  className = "",
  title,
  subtitle,
  actions,
}: CardProps) => {
  return (
    <div
      className={`bg-warm-light dark:bg-dark-surface rounded-lg border border-neutral-light dark:border-dark-bg border-primary ${className}`}
    >
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-neutral-light dark:border-dark-bg bg-primary-lighter/30 dark:bg-dark-bg/30">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
