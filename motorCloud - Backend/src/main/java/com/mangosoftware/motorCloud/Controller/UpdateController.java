package com.mangosoftware.motorCloud.Controller;

import com.mangosoftware.motorCloud.Model.Services.AutoUpdaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/update")
public class UpdateController {

    @Autowired
    private AutoUpdaterService updaterService;

    /**
     * GET /api/update/status
     * Devuelve la versión actual e info del último release de GitHub.
     * Útil para mostrar en el panel admin si hay actualización disponible.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> res = new HashMap<>();
        res.put("currentVersion", updaterService.getCurrentVersion());
        try {
            AutoUpdaterService.UpdateInfo info = updaterService.fetchLatestRelease();
            if (info != null) {
                res.put("latestVersion", info.version());
                res.put("updateAvailable",
                        !info.version().equals(updaterService.getCurrentVersion()));
            } else {
                res.put("latestVersion", "desconocida");
                res.put("updateAvailable", false);
            }
        } catch (Exception e) {
            res.put("latestVersion", "error");
            res.put("updateAvailable", false);
            res.put("error", e.getMessage());
        }
        return ResponseEntity.ok(res);
    }

    /**
     * POST /api/update/apply
     * Fuerza la actualización inmediatamente (solo ADMIN).
     * El sistema se reiniciará si hay una versión nueva.
     */
    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> apply() {
        Map<String, Object> res = new HashMap<>();
        try {
            // Ejecutar en hilo separado para devolver respuesta antes del System.exit
            new Thread(updaterService::checkForUpdate).start();
            res.put("success", true);
            res.put("message",
                    "Verificación de actualización iniciada. El sistema se reiniciará si hay una versión nueva.");
        } catch (Exception e) {
            res.put("success", false);
            res.put("message", e.getMessage());
        }
        return ResponseEntity.ok(res);
    }
}
