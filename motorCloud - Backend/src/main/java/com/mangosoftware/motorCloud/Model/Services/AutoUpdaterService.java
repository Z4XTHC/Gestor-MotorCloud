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
        HttpURLConnection conn = (HttpURLConnection) URI.create(url).toURL().openConnection();
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

        // Ruta del .jar actual
        Path currentJar = Path.of(
                AutoUpdaterService.class.getProtectionDomain()
                        .getCodeSource().getLocation().toURI());

        Path tempJar = currentJar.resolveSibling("motorCloud-new.jar");
        Path backupJar = currentJar.resolveSibling("motorCloud-backup.jar");

        log.info("[AutoUpdater] Descargando {} → {}", info.downloadUrl(), tempJar);

        // Descargar el nuevo .jar
        HttpURLConnection conn = (HttpURLConnection) URI.create(info.downloadUrl()).toURL().openConnection();
        conn.setConnectTimeout(60000);
        conn.setReadTimeout(60000);

        try (InputStream in = conn.getInputStream();
                OutputStream out = Files.newOutputStream(tempJar)) {
            in.transferTo(out);
        }

        log.info("[AutoUpdater] Descarga completa. Preparando actualización...");

        // Crear script que reemplaza el jar y reinicia (se ejecuta tras cerrar el
        // proceso)
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        Path updateScript = currentJar.resolveSibling(isWindows ? "do_update.bat" : "do_update.sh");

        if (isWindows) {
            String bat = "@echo off\r\n" +
                    "timeout /t 3 /nobreak > nul\r\n" +
                    "copy /Y \"" + tempJar + "\" \"" + currentJar + "\"\r\n" +
                    "del \"" + tempJar + "\"\r\n" +
                    "echo Actualización aplicada. Reiniciando...\r\n" +
                    "start \"\" javaw -jar \"" + currentJar + "\"\r\n";
            Files.writeString(updateScript, bat);
        } else {
            String sh = "#!/bin/bash\n" +
                    "sleep 3\n" +
                    "cp \"" + tempJar + "\" \"" + currentJar + "\"\n" +
                    "rm \"" + tempJar + "\"\n" +
                    "java -jar \"" + currentJar + "\" &\n";
            Files.writeString(updateScript, sh);
            updateScript.toFile().setExecutable(true);
        }

        // Lanzar el script y cerrar el proceso actual
        if (isWindows) {
            new ProcessBuilder("cmd", "/c", "start", "", updateScript.toString()).start();
        } else {
            new ProcessBuilder("bash", updateScript.toString()).start();
        }

        log.info("[AutoUpdater] Reiniciando para aplicar versión {}...", info.version());
        // Pequeña pausa para que los logs se escriban
        Thread.sleep(2000);
        System.exit(0);
    }

    /**
     * Compara versiones semánticas simples (1.0.0, 1.2.3, etc.).
     */
    private boolean isNewerVersion(String current, String latest) {
        try {
            String[] c = current.split("\\.");
            String[] l = latest.split("\\.");
            for (int i = 0; i < Math.max(c.length, l.length); i++) {
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
