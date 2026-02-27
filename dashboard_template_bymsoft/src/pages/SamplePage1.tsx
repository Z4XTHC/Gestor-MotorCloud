import React from "react";
import { Card } from "../components/common/Card";

const SamplePage1: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Página de Ejemplo 1</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Tarjeta 1" className="p-4">
          <p>Contenido de ejemplo para la primera tarjeta.</p>
        </Card>
        <Card title="Tarjeta 2" className="p-4">
          <p>Contenido de ejemplo para la segunda tarjeta.</p>
        </Card>
        <Card title="Tarjeta 3" className="p-4">
          <p>Contenido de ejemplo para la tercera tarjeta.</p>
        </Card>
      </div>
    </div>
  );
};

export default SamplePage1;
