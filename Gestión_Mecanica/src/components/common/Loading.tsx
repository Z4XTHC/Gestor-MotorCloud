import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export const Loading = ({
  message = "Cargando...",
  size = "md",
  fullScreen = false,
}: LoadingProps) => {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm z-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className={`${iconSizes[size]} animate-spin text-primary dark:text-dark-primary`}
        />
        <span
          className={`${textSizes[size]} font-medium text-gray-700 dark:text-gray-300`}
        >
          {message}
        </span>
      </div>
    </div>
  );
};
