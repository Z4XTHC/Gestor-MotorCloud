import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Cliente, Orden, Sucursal, Notificacion, Documento } from "../types";

interface CacheData {
  clientes: Cliente[] | null;
  ordenes: Orden[] | null;
  sucursales: Sucursal[] | null;
  notificaciones: Notificacion[] | null;
  documentos: Documento[] | null;
  clientesTimestamp: number | null;
  ordenesTimestamp: number | null;
  sucursalesTimestamp: number | null;
  notificacionesTimestamp: number | null;
  documentosTimestamp: number | null;
}

interface CacheContextType {
  cache: CacheData;
  setClientes: (clientes: Cliente[]) => void;
  setOrdenes: (ordenes: Orden[]) => void;
  setSucursales: (sucursales: Sucursal[]) => void;
  setNotificaciones: (notificaciones: Notificacion[]) => void;
  setDocumentos: (documentos: Documento[]) => void;
  getClientes: () => Cliente[] | null;
  getOrdenes: () => Orden[] | null;
  getSucursales: () => Sucursal[] | null;
  getNotificaciones: () => Notificacion[] | null;
  getDocumentos: () => Documento[] | null;
  clearCache: () => void;
  clearClientes: () => void;
  clearOrdenes: () => void;
  clearSucursales: () => void;
  clearNotificaciones: () => void;
  clearDocumentos: () => void;
  isCacheValid: (
    type:
      | "clientes"
      | "ordenes"
      | "sucursales"
      | "notificaciones"
      | "documentos",
    maxAge?: number
  ) => boolean;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider = ({ children }: { children: ReactNode }) => {
  const [cache, setCache] = useState<CacheData>({
    clientes: null,
    ordenes: null,
    sucursales: null,
    notificaciones: null,
    documentos: null,
    clientesTimestamp: null,
    ordenesTimestamp: null,
    sucursalesTimestamp: null,
    notificacionesTimestamp: null,
    documentosTimestamp: null,
  });

  // Tiempo de vida del caché por defecto: 5 minutos
  const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

  const setClientes = (clientes: Cliente[]) => {
    setCache((prev) => ({
      ...prev,
      clientes,
      clientesTimestamp: Date.now(),
    }));
  };

  const setOrdenes = (ordenes: Orden[]) => {
    setCache((prev) => ({
      ...prev,
      ordenes,
      ordenesTimestamp: Date.now(),
    }));
  };

  const setSucursales = (sucursales: Sucursal[]) => {
    setCache((prev) => ({
      ...prev,
      sucursales,
      sucursalesTimestamp: Date.now(),
    }));
  };

  const setNotificaciones = (notificaciones: Notificacion[]) => {
    setCache((prev) => ({
      ...prev,
      notificaciones,
      notificacionesTimestamp: Date.now(),
    }));
  };

  const setDocumentos = (documentos: Documento[]) => {
    setCache((prev) => ({
      ...prev,
      documentos,
      documentosTimestamp: Date.now(),
    }));
  };

  const getClientes = () => cache.clientes;
  const getOrdenes = () => cache.ordenes;
  const getSucursales = () => cache.sucursales;
  const getNotificaciones = () => cache.notificaciones;
  const getDocumentos = () => cache.documentos;

  const isCacheValid = (
    type:
      | "clientes"
      | "ordenes"
      | "sucursales"
      | "notificaciones"
      | "documentos",
    maxAge = DEFAULT_CACHE_TIME
  ) => {
    const timestamp =
      type === "clientes"
        ? cache.clientesTimestamp
        : type === "ordenes"
        ? cache.ordenesTimestamp
        : type === "sucursales"
        ? cache.sucursalesTimestamp
        : type === "documentos"
        ? cache.documentosTimestamp
        : cache.notificacionesTimestamp;
    if (!timestamp) return false;
    return Date.now() - timestamp < maxAge;
  };

  const clearClientes = () => {
    setCache((prev) => ({
      ...prev,
      clientes: null,
      clientesTimestamp: null,
    }));
  };

  const clearOrdenes = () => {
    setCache((prev) => ({
      ...prev,
      ordenes: null,
      ordenesTimestamp: null,
    }));
  };

  const clearSucursales = () => {
    setCache((prev) => ({
      ...prev,
      sucursales: null,
      sucursalesTimestamp: null,
    }));
  };

  const clearNotificaciones = () => {
    setCache((prev) => ({
      ...prev,
      notificaciones: null,
      notificacionesTimestamp: null,
    }));
  };

  const clearDocumentos = () => {
    setCache((prev) => ({
      ...prev,
      documentos: null,
      documentosTimestamp: null,
    }));
  };

  const clearCache = () => {
    setCache({
      clientes: null,
      ordenes: null,
      sucursales: null,
      notificaciones: null,
      documentos: null,
      clientesTimestamp: null,
      ordenesTimestamp: null,
      sucursalesTimestamp: null,
      notificacionesTimestamp: null,
      documentosTimestamp: null,
    });
  };

  // Escuchar cambios de usuario (login/logout) para invalidar caché
  // Empleado en cuando `AuthProvider` dispara el evento `auth:userChanged`.
  // Esto evita que un usuario vea datos cacheados de otro usuario en la misma sesión.
  useEffect(() => {
    const handler = (ev: Event) => {
      // limpiar caché al cambiar usuario
      clearCache();
    };
    try {
      window.addEventListener("auth:userChanged", handler as EventListener);
    } catch (e) {
      // Entorno sin window
    }
    return () => {
      try {
        window.removeEventListener(
          "auth:userChanged",
          handler as EventListener
        );
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CacheContext.Provider
      value={{
        cache,
        setClientes,
        setOrdenes,
        setSucursales,
        setNotificaciones,
        setDocumentos,
        getClientes,
        getOrdenes,
        getSucursales,
        getNotificaciones,
        getDocumentos,
        clearCache,
        clearClientes,
        clearOrdenes,
        clearSucursales,
        clearNotificaciones,
        clearDocumentos,
        isCacheValid,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error("useCache debe usarse dentro de CacheProvider");
  }
  return context;
};
