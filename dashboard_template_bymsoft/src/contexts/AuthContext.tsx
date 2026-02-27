import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthResponse } from "../types";
import axiosInstance from "../api/axiosConfig";
import { API_ENDPOINTS } from "../constants/api";
import Swal from "sweetalert2";

/**
 * @file AuthContext.tsx
 * @description Contexto de autenticación con modo mock.
 * @version 2.1 (Mock Mode - Original code commented)
 * @date 04/02/2026
 */

/*
// ===== CÓDIGO ORIGINAL (COMENTADO) - PARA USO FUTURO =====
// Este código original usa axios y API_ENDPOINTS para consumir servicios reales
// Descomenta estas funciones cuando conectes a un backend real

// ... código original del AuthContext comentado ...
// (El código original completo está comentado al final del archivo)
*/

// ===== FUNCIONES MOCK ACTIVAS =====

// Usuario mock para simulación
const mockUser: User = {
  _id: "1",
  email: "admin@example.com",
  nombre: "Administrador",
  apellido: "Sistema",
  status: "VERIFIED",
  admin: true,
  cliente_id: null,
  tecnico_id: null,
  role: "Admin",
};

// Credenciales válidas para login mock
const VALID_CREDENTIALS = {
  email: "admin@example.com",
  password: "123456",
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  locked: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: string,
  ) => Promise<void>;
  logout: () => void;
  lockSession: () => void;
  unlockSession: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let inactivityTimer: NodeJS.Timeout;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      // En lugar de desconectar al usuario inmediatamente, marcamos la sesión como bloqueada.
      // Esto permite mostrar la pantalla de desbloqueo sin perder el estado del usuario.
      setLocked(true);
      Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Tu sesión ha expirado por inactividad",
        confirmButtonColor: "#F39F23",
      });
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedLocked = localStorage.getItem("locked");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        resetInactivityTimer();

        // Inicializar estado locked desde localStorage (si existe)
        if (storedLocked === "true") {
          setLocked(true);
        } else {
          setLocked(false);
        }

        const events = ["mousedown", "keydown", "scroll", "touchstart"];
        events.forEach((event) => {
          document.addEventListener(event, resetInactivityTimer);
        });

        // Escuchar cambios en localStorage para sincronizar entre pestañas
        const handleStorage = (e: StorageEvent) => {
          if (!e.key) return;
          if (e.key === "user") {
            if (e.newValue) {
              try {
                setUser(JSON.parse(e.newValue));
              } catch (err) {}
            } else {
              setUser(null);
            }
          }
          if (e.key === "locked") {
            setLocked(e.newValue === "true");
          }
        };
        window.addEventListener("storage", handleStorage);

        setLoading(false);

        return () => {
          events.forEach((event) => {
            document.removeEventListener(event, resetInactivityTimer);
          });
          clearTimeout(inactivityTimer);
          window.removeEventListener("storage", handleStorage);
        };
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // ===== FUNCIONES MOCK =====

  const login = async (email: string, password: string) => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validar credenciales mock
    if (
      email === VALID_CREDENTIALS.email &&
      password === VALID_CREDENTIALS.password
    ) {
      // Crear tokens mock
      const mockToken = `mock-jwt-token-${Date.now()}`;
      const mockRefreshToken = `mock-refresh-token-${Date.now()}`;

      // Simular respuesta del backend
      const mockResponse: AuthResponse = {
        token: mockToken,
        refreshToken: mockRefreshToken,
        user: mockUser,
      };

      const { token, refreshToken, user: userData } = mockResponse;

      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(userData));

      // Marcar bandera temporal para evitar redirect inmediato por 401 justo después del login
      try {
        localStorage.setItem("justLoggedIn", "true");
        setTimeout(() => {
          try {
            localStorage.removeItem("justLoggedIn");
          } catch (e) {}
        }, 3000);
      } catch (e) {}

      // sincronizar locked en localStorage
      localStorage.setItem("locked", "false");

      // Emitir evento para que CacheContext limpie la caché antes de setear el usuario
      try {
        window.dispatchEvent(new Event("auth:userChanged"));
      } catch (e) {}

      setUser(userData);
      setLocked(false);
      resetInactivityTimer();

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: `Has iniciado sesión correctamente`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      throw new Error("Credenciales inválidas. Usa admin@example.com / 123456");
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: string,
  ) => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simular creación de usuario
    const newUser: User = {
      _id: Date.now().toString(),
      email,
      nombre: name,
      apellido: "",
      status: "VERIFIED",
      admin: role === "Admin",
      cliente_id: null,
      tecnico_id: null,
      role: role as any,
    };

    // Crear tokens mock
    const mockToken = `mock-jwt-token-${Date.now()}`;
    const mockRefreshToken = `mock-refresh-token-${Date.now()}`;

    const mockResponse: AuthResponse = {
      token: mockToken,
      refreshToken: mockRefreshToken,
      user: newUser,
    };

    const { token, refreshToken, user: userData } = mockResponse;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Emitir evento para limpiar caché antes de setear nuevo usuario
    try {
      window.dispatchEvent(new Event("auth:userChanged"));
    } catch (e) {}

    setUser(userData);
    resetInactivityTimer();

    Swal.fire({
      icon: "success",
      title: "Cuenta creada",
      text: "Tu cuenta ha sido creada exitosamente",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("locked");
    // Avisar al cache que el usuario cambió antes de actualizar el estado
    try {
      window.dispatchEvent(new Event("auth:userChanged"));
    } catch (e) {}

    setUser(null);
    setLocked(false);
    clearTimeout(inactivityTimer);
    // Mostrar confirmación amigable al cerrar sesión
    try {
      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Su sesión fue cerrada con éxito",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      // no-op
    }
  };

  const lockSession = () => {
    // marcar la sesión como bloqueada sin eliminar token/usuario
    setLocked(true);
    clearTimeout(inactivityTimer);
    try {
      localStorage.setItem("locked", "true");
    } catch (e) {}
  };

  const unlockSession = () => {
    // desbloquear la sesión y reiniciar el timer de inactividad
    setLocked(false);
    resetInactivityTimer();
    try {
      localStorage.setItem("locked", "false");
    } catch (e) {}
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      try {
        window.dispatchEvent(new Event("auth:userChanged"));
      } catch (e) {}
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        locked,
        login,
        signup,
        logout,
        lockSession,
        unlockSession,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/*
// ===== CÓDIGO ORIGINAL COMPLETO (COMENTADO) =====
// Este es el código original que usa axios y API_ENDPOINTS
// Descomenta todo este bloque cuando conectes a un backend real

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email,
        password,
      }
    );

    const { token, refreshToken, user: userData } = response.data;

    // Decodificar el token para obtener el ID del usuario
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));

    // Preferir los datos que devuelve el backend en `userData` (más fiables)
    // Evitar llamadas a endpoints admin-only que devuelven 401 para técnicos
    let completeUserData: any = {
      _id: payload.id,
      email: email,
      status: userData?.status || "VERIFIED",
      admin: false,
      cliente_id: null,
      tecnico_id: null,
    };

    // Si el backend ya devolvió información de técnico o cliente, úsala directamente
    if (userData) {
      if ((userData as any).tecnico) {
        const t = (userData as any).tecnico;
        completeUserData = {
          ...completeUserData,
          nombre: t.nombre,
          apellido: t.apellido,
          tecnico_id: t._id || t.id,
          admin: false,
          email: t.email || completeUserData.email,
        };
      } else if ((userData as any).cliente) {
        const c = (userData as any).cliente;
        completeUserData = {
          ...completeUserData,
          nombreFantasia: c.nombreFantasia || c.razonSocial,
          cliente_id: c._id || c.id,
          admin: false,
          email: c.email || completeUserData.email,
        };
      } else if ((userData as any).admin) {
        // Caso admin: usar los datos tal cual
        completeUserData = { ...completeUserData, ...userData };
      }
    }

    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("user", JSON.stringify(completeUserData));
    // Marcar bandera temporal para evitar redirect inmediato por 401 justo después del login
    try {
      localStorage.setItem("justLoggedIn", "true");
      setTimeout(() => {
        try {
          localStorage.removeItem("justLoggedIn");
          } catch (e) {}
      }, 3000);
    } catch (e) {}
    // sincronizar locked en localStorage
    localStorage.setItem("locked", "false");

    // Emitir evento para que CacheContext limpie la caché antes de setear el usuario
    try {
      window.dispatchEvent(new Event("auth:userChanged"));
    } catch (e) {}

    setUser(completeUserData);
    setLocked(false);
    resetInactivityTimer();

    Swal.fire({
      icon: "success",
      title: "Bienvenido",
      text: `Has iniciado sesión correctamente`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error: unknown) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Error al iniciar sesión";
    throw new Error(errorMessage);
  }
};

const signup = async (
  email: string,
  password: string,
  name: string,
  role: string
) => {
  try {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      {
        email,
        password,
        name,
        role,
      }
    );

    const { token, refreshToken, user: userData } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    // Emitir evento para limpiar caché antes de setear nuevo usuario
    try {
      window.dispatchEvent(new Event("auth:userChanged"));
    } catch (e) {}

    setUser(userData);
    resetInactivityTimer();

    Swal.fire({
      icon: "success",
      title: "Cuenta creada",
      text: "Tu cuenta ha sido creada exitosamente",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error: unknown) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } }).response?.data
        ?.message || "Error al crear cuenta";
    throw new Error(errorMessage);
  }
};

// ===== FIN DEL CÓDIGO ORIGINAL COMENTADO =====
*/
