package com.mangosoftware.motorCloud.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Reenvía las rutas del frontend (React Router) a index.html.
 * Solo aplica a rutas sin extensión de archivo para no interceptar
 * los assets estáticos (/assets/*.js, *.css, etc.).
 */
@Controller
public class SpaController {

    // Segmento único sin punto: /dashboard, /clientes, etc.
    // Dos segmentos sin punto: /dashboard/clientes, /ordenes/nueva, etc.
    // No coincide con /assets/file.js porque "file.js" tiene un punto.
    @RequestMapping(value = {
            "/",
            "/{path:[^\\.]*}",
            "/{path:[^\\.]*}/{subpath:[^\\.]*}",
            "/{path:[^\\.]*}/{subpath:[^\\.]*}/{sub2:[^\\.]*}"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
