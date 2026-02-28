package com.mangosoftware.motorCloud.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mangosoftware.motorCloud.Model.Entity.Vehiculo;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iVehiculoService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/api/vehiculos")
public class VehiculoController {

    @Autowired
    private iVehiculoService vehiculoService;

    @GetMapping("/")
    public ResponseEntity<List<Vehiculo>> getAllVehiculos() {
        List<Vehiculo> vehiculos = vehiculoService.getAllVehiculos();
        return ResponseEntity.ok(vehiculos);
    }

    @PostMapping("/guardar")
    public ResponseEntity<Vehiculo> guardarVehiculo(@Valid @RequestBody Vehiculo vehiculo, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(null);
        }

        Vehiculo nuevoVehiculo = vehiculoService.createVehiculo(vehiculo);
        return ResponseEntity.ok(nuevoVehiculo);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Vehiculo> actualizarVehiculo(@PathVariable Long id, @Valid @RequestBody Vehiculo vehiculo,
            BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(null);
        }

        Vehiculo vehiculoActualizado = vehiculoService.updateVehiculo(id, vehiculo);
        if (vehiculoActualizado != null) {
            return ResponseEntity.ok(vehiculoActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/cambiar-estado/{id}")
    public ResponseEntity<Vehiculo> cambiarEstadoVehiculo(@PathVariable Long id,
            @RequestBody Map<String, Boolean> status) {
        Boolean nuevoStatus = status.get("status");
        Vehiculo vehiculoActualizado = vehiculoService.changeStatus(id, nuevoStatus);
        if (vehiculoActualizado != null) {
            return ResponseEntity.ok(vehiculoActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/detalles/{id}")
    public ResponseEntity<Vehiculo> obtenerDetallesVehiculo(@PathVariable Long id) {
        Vehiculo vehiculo = vehiculoService.getVehiculoById(id);
        if (vehiculo != null) {
            return ResponseEntity.ok(vehiculo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
