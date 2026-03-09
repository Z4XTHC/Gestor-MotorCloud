package com.mangosoftware.motorCloud.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mangosoftware.motorCloud.Model.Entity.Inventario;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iInventarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private iInventarioService inventarioService;

    @GetMapping
    public ResponseEntity<List<Inventario>> getAllInventario() {
        return ResponseEntity.ok(inventarioService.getAllInventarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventario> getInventarioById(@PathVariable Long id) {
        Inventario item = inventarioService.getInventarioById(id);
        return item != null ? ResponseEntity.ok(item) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Inventario> createInventario(@Valid @RequestBody Inventario inventario,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(inventarioService.createInventario(inventario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventario> updateInventario(@PathVariable Long id, @Valid @RequestBody Inventario inventario,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        Inventario actualizado = inventarioService.updateInventario(id, inventario);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventario(@PathVariable Long id) {
        inventarioService.deleteInventario(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Inventario> changeStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        Boolean newStatus = status.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().build();
        }
        Inventario actualizado = inventarioService.changeStatus(id, newStatus);
        return actualizado != null ? ResponseEntity.ok(actualizado) : ResponseEntity.notFound().build();
    }
}
