package com.mangosoftware.motorCloud.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mangosoftware.motorCloud.Model.Entity.Cliente;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iClienteService;

@Controller
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private iClienteService clienteService;

    @GetMapping("/")
    public ResponseEntity<List<Cliente>> getAllClientes() {
        List<Cliente> clientes = clienteService.getAllClientes();
        return ResponseEntity.ok(clientes);
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarCliente(@RequestBody Cliente cliente) {
        // Solo verificar duplicado si el DNI fue ingresado
        if (cliente.getDni() != null && !cliente.getDni().isBlank()) {
            if (clienteService.exitsByDni(cliente.getDni())) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "Ya existe un cliente con el DNI: " + cliente.getDni());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }
        }

        Cliente nuevoCliente = clienteService.createCliente(cliente);
        return ResponseEntity.ok(nuevoCliente);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Cliente> actualizarCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
        Cliente clienteActualizado = clienteService.updateCliente(id, cliente);
        if (clienteActualizado != null) {
            return ResponseEntity.ok(clienteActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/cambiar-estado/{id}")
    public ResponseEntity<Cliente> cambiarEstadoCliente(@PathVariable Long id,
            @RequestBody Map<String, Boolean> status) {
        Boolean nuevoStatus = status.get("status");
        Cliente clienteActualizado = clienteService.changeStatus(id, nuevoStatus);
        if (clienteActualizado != null) {

            return ResponseEntity.ok(clienteActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/detalles/{id}")
    public ResponseEntity<Cliente> obtenerDetallesCliente(@PathVariable Long id) {
        Cliente cliente = clienteService.getClienteById(id);
        if (cliente != null) {
            return ResponseEntity.ok(cliente);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
