package com.mangosoftware.motorCloud.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mangosoftware.motorCloud.Model.Entity.Empresa;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iEmpresaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/empresa")
@CrossOrigin(origins = "*") // Recomendado para conectar con el Frontend de Motor Cloud
public class EmpresaController {

    @Autowired
    private iEmpresaService empresaService;

    /**
     * Obtiene la configuración de la empresa única.
     * Al ser un registro único, devolvemos el objeto directamente
     * en lugar de una lista para facilitar el binding en el Frontend.
     */
    @GetMapping
    public ResponseEntity<Empresa> getEmpresa() {
        // Asumimos que el service internamente busca el ID 1 o el único existente
        Empresa empresa = empresaService.getEmpresaUnica();
        return ResponseEntity.ok(empresa);
    }

    /**
     * Actualiza los datos de la empresa (Siempre ID 1).
     * 
     * @param empresa Objeto con los nuevos datos fiscales, contacto, etc.
     */
    @PutMapping
    public ResponseEntity<Empresa> updateEmpresa(@Valid @RequestBody Empresa empresa) {
        // Forzamos el ID 1 para asegurar que nunca se cree un segundo registro
        Empresa empresaActualizada = empresaService.updateEmpresa(1L, empresa);
        return ResponseEntity.ok(empresaActualizada);
    }
}
