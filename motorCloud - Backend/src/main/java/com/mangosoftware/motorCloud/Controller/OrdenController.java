package com.mangosoftware.motorCloud.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mangosoftware.motorCloud.Model.Entity.Orden;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iOrdenService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/api/ordenes")
public class OrdenController {

    @Autowired
    private iOrdenService ordenService;

    @GetMapping("/")
    public ResponseEntity<List<Orden>> getAllOrdenes() {
        List<Orden> ordenes = ordenService.getAllOrdenes();
        return ResponseEntity.ok(ordenes);
    }

    @PostMapping("/guardar")
    public ResponseEntity<Orden> guardarOrden(@Valid @RequestBody Orden orden) {
        Orden nuevaOrden = ordenService.createOrden(orden);
        return ResponseEntity.ok(nuevaOrden);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Orden> actualizarOrden(@PathVariable Long id, @Valid @RequestBody Orden orden) {
        Orden ordenActualizada = ordenService.updateOrden(id, orden);
        if (ordenActualizada != null) {
            return ResponseEntity.ok(ordenActualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/cambiar-estado/{id}")
    public ResponseEntity<Orden> cambiarEstadoOrden(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        Boolean nuevoStatus = status.get("status");
        Orden ordenActualizada = ordenService.changeStatus(id, nuevoStatus);
        if (ordenActualizada != null) {
            return ResponseEntity.ok(ordenActualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/detalles/{id}")
    public ResponseEntity<Orden> obtenerDetallesOrden(@PathVariable Long id) {
        Orden orden = ordenService.getOrdenById(id);
        if (orden != null) {
            return ResponseEntity.ok(orden);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
