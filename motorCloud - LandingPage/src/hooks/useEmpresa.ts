import { useEffect, useState } from "react";
import { obtenerDatosEmpresa } from "../api/empresaApi";
import { Empresa } from "../types/empresa";

export function useEmpresa() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerDatosEmpresa()
      .then(setEmpresa)
      .catch(() => setError("No se pudo cargar la información de la empresa"))
      .finally(() => setLoading(false));
  }, []);

  return { empresa, loading, error };
}
