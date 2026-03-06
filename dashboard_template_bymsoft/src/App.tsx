import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CacheProvider } from "./contexts/CacheContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NewPassword from "./pages/auth/NewPassword";
import UnlockSession from "./pages/auth/Lock";
import { Dashboard } from "./pages/Dashboard";
import { NotificacionesList } from "./pages/notificaciones/NotificacionesList";
import { ConfiguracionIndex } from "./pages/configuracion/ConfiguracionIndex";
import { Interfaz } from "./pages/configuracion/config/Interfaz";
import { AcercaDe } from "./pages/AcercaDe";
import { Forbidden } from "./pages/Forbidden";
import AccesoDenegado from "./pages/AccesoDenegado";
import Error404 from "./pages/Error404";
import EnConstruccion from "./pages/EnConstruccion";
import { ActivateAccount } from "./pages/auth/ActivateAccount";
import { LegacyValidateRedirect } from "./pages/auth/LegacyValidateRedirect";
import AuthResetRedirect from "./pages/auth/AuthResetRedirect";
import { PublicLayout } from "./components/layout/PublicLayout";
import MiPerfil from "./pages/miPerfil";
import SamplePage1 from "./pages/SamplePage1";
import SamplePage2 from "./pages/SamplePage2";
import SamplePage3 from "./pages/SamplePage3";
import { UsuariosList } from "./pages/usuarios/UsuariosList";
import { ClienteList, ClientesList } from "./pages/clientes/ClientesList";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CacheProvider>
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route
                path="/login"
                element={
                  <PublicLayout>
                    <Login />
                  </PublicLayout>
                }
              />

              <Route
                path="/auth/reset-password"
                element={
                  <PublicLayout>
                    <AuthResetRedirect />
                  </PublicLayout>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicLayout>
                    <Register />
                  </PublicLayout>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <PublicLayout>
                    <ForgotPassword />
                  </PublicLayout>
                }
              />

              <Route
                path="/reset-password/:id"
                element={
                  <PublicLayout>
                    <NewPassword />
                  </PublicLayout>
                }
              />

              <Route
                path="/lock"
                element={
                  <PublicLayout>
                    <UnlockSession />
                  </PublicLayout>
                }
              />

              {/* Rutas protegidas */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notificaciones"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <NotificacionesList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/clientes"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <MainLayout>
                      <ClientesList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <MainLayout>
                      <UsuariosList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Páginas de ejemplo */}
              <Route
                path="/sample-page-1"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SamplePage1 />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sample-page-2"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SamplePage2 />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sample-page-3"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SamplePage3 />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Configuración */}
              <Route
                path="/configuracion"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <MainLayout>
                      <ConfiguracionIndex />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/interfaz"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <MainLayout>
                      <Interfaz />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/acerca-de"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AcercaDe />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MiPerfil />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Rutas de error */}
              <Route path="/acceso-denegado" element={<AccesoDenegado />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="/error-404" element={<Error404 />} />
              <Route path="/en-construccion" element={<EnConstruccion />} />

              {/* Rutas de activación */}
              <Route
                path="/activation/:id"
                element={
                  <PublicLayout>
                    <ActivateAccount />
                  </PublicLayout>
                }
              />

              <Route
                path="/usuarios/validate"
                element={
                  <PublicLayout>
                    <LegacyValidateRedirect />
                  </PublicLayout>
                }
              />

              {/* Redirecciones */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/inicio"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/home"
                element={<Navigate to="/dashboard" replace />}
              />

              {/* Redirige cualquier ruta no definida a la página de error 404 */}
              <Route path="*" element={<Navigate to="/error-404" replace />} />

              {/* Rutas de imagenes para evitar el 404 */}
              <Route path="/images/img/LogoAuditoria_1.png" element={<></>} />
              <Route path="/images/img/Slogan_1.png" element={<></>} />
            </Routes>
          </BrowserRouter>
        </CacheProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
