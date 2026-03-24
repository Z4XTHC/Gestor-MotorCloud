package com.mangosoftware.motorCloud.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración web global para la aplicación.
 * Incluye la configuración de CORS (Cross-Origin Resource Sharing).
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configura los permisos de CORS para toda la aplicación.
     * Esto es crucial para permitir que el frontend (React/Vue/Angular), que corre en un origen diferente,
     * pueda hacer peticiones a este backend.
     *
     * @param registry El registro de CORS donde se añaden los mapeos.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Aplica la configuración a todos los endpoints bajo /api
                .allowedOrigins(
                        "http://localhost:5173", // Origen del frontend de Vite en desarrollo
                        "http://localhost:3000", // Origen común para Create React App
                        "http://127.0.0.1:5173"  // Otro posible origen en desarrollo
                        // NOTA: En producción, deberías añadir la URL de tu frontend desplegado.
                        // Ejemplo: "https://www.mi-taller.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*") // Permite todas las cabeceras en la petición
                .allowCredentials(true) // Permite el envío de cookies y credenciales de autenticación
                .maxAge(3600); // Tiempo que el navegador puede cachear la configuración de CORS
    }
}
