package com.mangosoftware.motorCloud.Model.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mangosoftware.motorCloud.Model.Entity.Inventario;

public interface iInventarioRepository extends JpaRepository<Inventario, Long> {

    // Obtener Inventario por Estado
    List<Inventario> findByStatus(Boolean status);

    // Verificar si el inventario existe por Nombre
    boolean existsByNombre(String nombre);

    // Verificar si el inventario existe por Código
    boolean existsByCodigo(String codigo);
}
