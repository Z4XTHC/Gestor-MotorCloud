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

interface AuthContextType {
  user: any | null;
  loading: boolean;
  locked: boolean;
  login: (usuario: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  lockSession: () => void;
  unlockSession: () => void;
  updateUser: (userData: Partial<any>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let inactivityTimer: ReturnType<typeof setTimeout>;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      setLocked(true);
      try {
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: "Tu sesión ha expirado por inactividad",
          confirmButtonColor: "#F39F23",
        });
      } catch (e) {}
    }, INACTIVITY_TIMEOUT);
  };

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

  // Al montar, verificar sesión en backend (/api/auth/check)
  useEffect(() => {
    const init = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedLocked = localStorage.getItem("locked");

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem("user");
          }
        }

        if (storedLocked === "true") setLocked(true);

        // Registrar listeners de actividad
        const events = ["mousedown", "keydown", "scroll", "touchstart"];
        events.forEach((ev) =>
          document.addEventListener(ev, resetInactivityTimer),
        );
        window.addEventListener("storage", handleStorage);

        // Comprobar con backend si la sesión es válida
        try {
          const res = await axiosInstance.get(API_ENDPOINTS.AUTH.CHECK);
          if (res?.data?.authenticated) {
            const serverUser = res.data;
            const userId = serverUser.id || serverUser.ID || null;
            // Enriquecer con datos completos del usuario (apellido, rol, status, etc.)
            let fullUser: any = null;
            if (userId) {
              try {
                const uRes = await axiosInstance.get(
                  API_ENDPOINTS.USERS.GET(String(userId)),
                );
                fullUser = uRes.data;
              } catch (e) {}
            }
            const mapped = {
              id: userId,
              username:
                fullUser?.username ||
                serverUser.usuario ||
                serverUser.username ||
                null,
              nombre: fullUser?.nombre || serverUser.nombre || null,
              apellido: fullUser?.apellido || null,
              rol: fullUser?.rol || null,
              status: fullUser?.status ?? true,
            };
            setUser(mapped);
            localStorage.setItem("user", JSON.stringify(mapped));
            resetInactivityTimer();
          } else {
            // no autenticado: limpiar localStorage
            localStorage.removeItem("user");
          }
        } catch (err) {
          // ignore, puede no estar disponible en dev
        }

        setLoading(false);

        return () => {
          events.forEach((ev) =>
            document.removeEventListener(ev, resetInactivityTimer),
          );
          clearTimeout(inactivityTimer);
          window.removeEventListener("storage", handleStorage);
        };
      } catch (error) {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (usuario: string, password: string) => {
    try {
      const params = new URLSearchParams();
      // El backend espera los parámetros `username` y `password` (ver AuthController)
      params.append("username", usuario);
      params.append("password", password);

      const res = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = res.data;
      if (!data) throw new Error("Respuesta inválida del servidor");

      if (data.success === false) {
        throw new Error(data.message || "Credenciales inválidas");
      }

      // Backend no devuelve token JWT en este proyecto; la sesión se maneja por cookie.
      const userId = data.id || data.ID || null;
      // Enriquecer con datos completos del usuario (apellido, rol, status, etc.)
      let fullUser: any = null;
      if (userId) {
        try {
          const uRes = await axiosInstance.get(
            API_ENDPOINTS.USERS.GET(String(userId)),
          );
          fullUser = uRes.data;
        } catch (e) {}
      }
      const mapped = {
        id: userId,
        username: fullUser?.username || data.usuario || usuario,
        nombre: fullUser?.nombre || data.nombre || null,
        apellido: fullUser?.apellido || null,
        rol: fullUser?.rol || null,
        status: fullUser?.status ?? true,
      };

      localStorage.setItem("user", JSON.stringify(mapped));
      localStorage.setItem("locked", "false");
      try {
        window.dispatchEvent(new Event("auth:userChanged"));
      } catch (e) {}

      setUser(mapped);
      setLocked(false);
      resetInactivityTimer();

      try {
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: `Has iniciado sesión correctamente`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (e) {}
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error al iniciar sesión";
      throw new Error(msg);
    }
  };

  const signup = async (
    _email: string,
    _password: string,
    _name: string,
    _role: string,
  ) => {
    // El backend actual no expone un endpoint de registro público en AuthController.
    throw new Error(
      "Registro no soportado por el backend (implementación pendiente)",
    );
  };

  const logout = async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (e) {
      // ignore errors on logout
    }

    localStorage.removeItem("user");
    localStorage.removeItem("locked");
    try {
      window.dispatchEvent(new Event("auth:userChanged"));
    } catch (e) {}

    setUser(null);
    setLocked(false);
    clearTimeout(inactivityTimer);

    try {
      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Su sesión fue cerrada con éxito",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (e) {}
  };

  const lockSession = () => {
    setLocked(true);
    clearTimeout(inactivityTimer);
    try {
      localStorage.setItem("locked", "true");
    } catch (e) {}
  };

  const unlockSession = () => {
    setLocked(false);
    resetInactivityTimer();
    try {
      localStorage.setItem("locked", "false");
    } catch (e) {}
  };

  const updateUser = (userData: Partial<any>) => {
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

    // Mapear usuario del backend Java con rol ADMIN o USER
    let completeUserData: any = {
      id: userData?.id || payload.id,
      _id: userData?.id || payload.id,
      email: userData?.email || email,
      usuario: userData?.usuario,
      nombre: userData?.nombre,
      apellido: userData?.apellido,
      rol: userData?.rol || "USER", // ADMIN o USER
      status: userData?.status !== false,
    };

    // Mantener compatibilidad con referencias antiguas
    if (completeUserData.rol === "ADMIN") {
      completeUserData.admin = true;
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
