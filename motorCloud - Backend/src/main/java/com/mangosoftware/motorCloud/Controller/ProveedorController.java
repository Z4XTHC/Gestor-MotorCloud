package com.mangosoftware.motorCloud.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mangosoftware.motorCloud.Model.Entity.Proveedor;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iProveedorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    iProveedorService proveedorService;

    @GetMapping
    public ResponseEntity<List<Proveedor>> getAllProveedores() {
        List<Proveedor> proveedores = proveedorService.getAllProveedores();
        return ResponseEntity.ok(proveedores);
    }

    @PostMapping
    public ResponseEntity<Proveedor> createProveedor(@Valid @RequestBody Proveedor proveedor, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(null);
        }

        if (proveedorService.existsByCuit(proveedor.getCuit())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        Proveedor nuevoProveedor = proveedorService.createProveedor(proveedor);

        return ResponseEntity.ok(nuevoProveedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> updateProveedor(@PathVariable Long id, @Valid @RequestBody Proveedor proveedor,
            BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(null);
        }

        Proveedor proveedorActualizado = proveedorService.updateProveedor(id, proveedor);

        return ResponseEntity.ok(proveedorActualizado);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Proveedor> changeStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> status) {
        if (!status.containsKey("status")) {
            return ResponseEntity.badRequest().body(null);
        }

        Boolean nuevoStatus = status.get("status");
        Proveedor proveedorActualizado = proveedorService.changeStatus(id, nuevoStatus);

        return ResponseEntity.ok(proveedorActualizado);
    }

    @GetMapping("/detalles/{id}")
    public ResponseEntity<Proveedor> getProveedorById(@PathVariable Long id) {
        Proveedor proveedor = proveedorService.getProveedorById(id);

        return ResponseEntity.ok(proveedor);
    }

}
