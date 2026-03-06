package com.mangosoftware.motorCloud.Controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.mangosoftware.motorCloud.Model.Services.Interfaces.iUsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private iUsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestParam String username,
            @RequestParam String password,
            HttpServletRequest request) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Autenticar usuario con Spring Security
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            // Establecer el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Crear sesión
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            // Respuesta base — el login ya fue exitoso a partir de aquí
            response.put("success", true);
            response.put("message", "Login exitoso");
            response.put("usuario", username);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Enriquecer con id y nombre — en un bloque separado para que
        // un fallo aquí NO revierta el login ya autenticado.
        // Usamos getAllUsuarios() + filter para mayor compatibilidad.
        try {
            usuarioService.getAllUsuarios().stream()
                    .filter(u -> username.equals(u.getUsername()))
                    .findFirst()
                    .ifPresent(u -> {
                        response.put("id", u.getId());
                        response.put("nombre", u.getNombre());
                    });
        } catch (Exception e) {
            log.warn("[AuthController] No se pudo enriquecer respuesta para '{}': {}", username, e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        response.put("success", true);
        response.put("message", "Logout exitoso");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAuthentication() {
        Map<String, Object> response = new HashMap<>();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null &&
                authentication.isAuthenticated() &&
                !(authentication.getPrincipal() instanceof String);

        response.put("authenticated", isAuthenticated);
        if (isAuthenticated) {
            String username = authentication.getName();
            response.put("usuario", username);
            // Incluir id para restaurar la sesión de caja al recargar la página
            try {
                usuarioService.getAllUsuarios().stream()
                        .filter(u -> username.equals(u.getUsername()))
                        .findFirst()
                        .ifPresent(u -> {
                            response.put("id", u.getId());
                            response.put("nombre", u.getNombre());
                        });
            } catch (Exception e) {
                log.warn("[AuthController] No se pudo enriquecer check para '{}': {}", username, e.getMessage());
            }
        }

        return ResponseEntity.ok(response);
    }
}