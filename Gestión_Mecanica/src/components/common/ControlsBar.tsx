import React from "react";
import SearchInput from "./SearchInput";
import { Button } from "./Button";

interface ControlsBarProps {
  searchValue: string;
  onSearchChange: (v: string) => void;
  onAdd?: () => void;
  children?: React.ReactNode;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({ searchValue, onSearchChange, onAdd, children }) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1">
          <SearchInput value={searchValue} onChange={onSearchChange} />
        </div>
        {children}
      </div>

      {onAdd && (
        <div>
          <Button onClick={onAdd}>Agregar</Button>
        </div>
      )}
    </div>
  );
};

export default ControlsBar;
