package com.mangosoftware.motorCloud.Model.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mangosoftware.motorCloud.Model.Entity.Proveedor;

public interface iProveedorRepository extends JpaRepository<Proveedor, Long> {

    // Obtener Proveedor por Estado
    List<Proveedor> findByStatus(Boolean status);

    // Verificar si el proveedor existe por CUIT
    boolean existsByCuit(String cuit);
    
}
