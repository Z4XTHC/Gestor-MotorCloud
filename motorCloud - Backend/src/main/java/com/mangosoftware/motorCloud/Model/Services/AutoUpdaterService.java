package com.mangosoftware.motorCloud.Model.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.file.*;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Servicio de auto-actualización.
 * Cada hora consulta GitHub Releases, y si hay una versión más nueva
 * descarga el .jar, lo reemplaza y reinicia el proceso.
 *
 * Para que funcione, el .jar debe ejecutarse con el script launch.bat/sh
 * que lo reinicia automáticamente cuando el proceso termina.
 */
@Service
public class AutoUpdaterService {

    private static final Logger log = LoggerFactory.getLogger(AutoUpdaterService.class);

    @Value("${app.version}")
    private String currentVersion;

    @Value("${app.github.repo}")
    private String githubRepo;

    private final AtomicBoolean updateInProgress = new AtomicBoolean(false);

    // Verificar cada hora (en milisegundos). Cambiar a gusto.
    @Scheduled(fixedDelay = 60 * 60 * 1000, initialDelay = 30 * 1000)
    public void checkForUpdate() {
        if (updateInProgress.get())
            return;
        try {
            log.info("[AutoUpdater] Verificando actualizaciones (versión actual: {})...", currentVersion);
            UpdateInfo info = fetchLatestRelease();
            if (info == null)
                return;

            if (isNewerVersion(currentVersion, info.version())) {
                log.info("[AutoUpdater] Nueva versión disponible: {} → descargando...", info.version());
                applyUpdate(info);
            } else {
                log.info("[AutoUpdater] Sistema actualizado ({})", currentVersion);
            }
        } catch (Exception e) {
            log.warn("[AutoUpdater] Error verificando actualizaciones: {}", e.getMessage());
        }
    }

    /**
     * Expuesto para llamarlo manualmente desde el controller.
     */
    public UpdateInfo fetchLatestRelease() throws Exception {
        String url = "https://api.github.com/repos/" + githubRepo + "/releases/latest";
        URL githubUrl = URI.create(url).toURL();
        HttpURLConnection conn = (HttpURLConnection) githubUrl.openConnection();
        conn.setRequestProperty("Accept", "application/vnd.github+json");
        conn.setRequestProperty("User-Agent", "motorCloud-updater");
        conn.setConnectTimeout(8000);
        conn.setReadTimeout(8000);

        if (conn.getResponseCode() != 200) {
            log.warn("[AutoUpdater] GitHub respondió {}", conn.getResponseCode());
            return null;
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(conn.getInputStream());

        String latestVersion = root.get("tag_name").asText().replace("v", "");
        String downloadUrl = null;

        for (JsonNode asset : root.get("assets")) {
            String name = asset.get("name").asText();
            if (name.endsWith(".jar")) {
                downloadUrl = asset.get("browser_download_url").asText();
                break;
            }
        }

        if (downloadUrl == null) {
            log.warn("[AutoUpdater] El release {} no tiene un .jar adjunto", latestVersion);
            return null;
        }

        return new UpdateInfo(latestVersion, downloadUrl);
    }

    private void applyUpdate(UpdateInfo info) throws Exception {
        updateInProgress.set(true);

        // Obtener la ruta del JAR actual de forma segura
        String path = AutoUpdaterService.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
        if (System.getProperty("os.name").toLowerCase().contains("win") && path.startsWith("/")) {
            path = path.substring(1);
        }
        Path currentJar = Path.of(path);

        // El nombre del JAR de la release puede ser diferente, pero launch.bat espera un nombre fijo.
        // Asumimos que el JAR actual tiene el nombre esperado por launch.bat (ej: motorCloud.jar).
        // Descargamos el nuevo JAR a un archivo temporal.
        Path tempJar = currentJar.resolveSibling("motorCloud-new.jar");

        log.info("[AutoUpdater] Descargando {} → {}", info.downloadUrl(), tempJar);

        // Descargar el nuevo .jar
        URL downloadUrl = URI.create(info.downloadUrl()).toURL();
        HttpURLConnection conn = (HttpURLConnection) downloadUrl.openConnection();
        conn.setConnectTimeout(60000);
        conn.setReadTimeout(60000);

        try (InputStream in = conn.getInputStream();
                OutputStream out = Files.newOutputStream(tempJar)) {
            in.transferTo(out);
        }

        log.info("[AutoUpdater] Descarga completa. Preparando script de actualización...");

        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        Path updateScript = currentJar.resolveSibling(isWindows ? "do_update.bat" : "do_update.sh");

        if (isWindows) {
            String bat = "@echo off\r\n" +
                    "echo [AutoUpdater] Aplicando actualizacion...\r\n" +
                    "rem Espera a que el proceso de Java se cierre completamente.\r\n" +
                    "timeout /t 2 /nobreak > nul\r\n" +
                    "rem Reemplaza el JAR antiguo con el nuevo. El nombre del JAR destino es el que espera launch.bat\r\n" +
                    "move /Y \"" + tempJar.toAbsolutePath() + "\" \"" + currentJar.toAbsolutePath() + "\"\r\n" +
                    "echo [AutoUpdater] Actualizacion lista. El sistema se reiniciara.\r\n" +
                    "del \"%~f0\"\r\n"; // El script se borra a si mismo
            Files.writeString(updateScript, bat);
        } else {
            // En Linux/macOS, es importante usar 'mv' para que la operación sea atómica.
            String sh = "#!/bin/bash\n" +
                    "echo \"[AutoUpdater] Aplicando actualizacion...\"\n" +
                    "sleep 2\n" +
                    "mv -f \"" + tempJar.toAbsolutePath() + "\" \"" + currentJar.toAbsolutePath() + "\"\n" +
                    "echo \"[AutoUpdater] Actualizacion lista. El sistema se reiniciara.\"\n" +
                    "rm -- \"$0\"\n"; // El script se borra a si mismo
            Files.writeString(updateScript, sh);
            updateScript.toFile().setExecutable(true, true);
        }

        log.info("[AutoUpdater] Lanzando script de actualización y reiniciando...");

        // Lanzar el script en un proceso separado y desvinculado.
        if (isWindows) {
            // "start" en cmd es la forma de lanzar algo en segundo plano.
            new ProcessBuilder("cmd", "/c", "start", "/min", updateScript.toAbsolutePath().toString()).start();
        } else {
            // Se necesita lanzar el script con "nohup" y "&" para que continue corriendo si el proceso padre muere.
             new ProcessBuilder("nohup", "bash", updateScript.toAbsolutePath().toString(), "&").start();
        }

        // Pequeña pausa para asegurar que los logs se escriben antes de salir.
        Thread.sleep(1000);

        // Salir con código 0. launch.bat/sh detectará esto y reiniciará la aplicación.
        System.exit(0);
    }

    /**
     * Compara versiones semánticas simples (1.0.0, 1.2.3, etc.).
     */
    private boolean isNewerVersion(String current, String latest) {
        try {
            String[] c = current.split("\\.");
            String[] l = latest.replaceAll("[^0-9.]", "").split("\\.");
            int length = Math.max(c.length, l.length);
            for (int i = 0; i < length; i++) {
                int cv = i < c.length ? Integer.parseInt(c[i]) : 0;
                int lv = i < l.length ? Integer.parseInt(l[i]) : 0;
                if (lv > cv)
                    return true;
                if (lv < cv)
                    return false;
            }
        } catch (Exception e) {
            log.warn("[AutoUpdater] No se pudo comparar versiones: {} vs {}", current, latest);
        }
        return false;
    }

    public String getCurrentVersion() {
        return currentVersion;
    }

    public record UpdateInfo(String version, String downloadUrl) {
    }
}
