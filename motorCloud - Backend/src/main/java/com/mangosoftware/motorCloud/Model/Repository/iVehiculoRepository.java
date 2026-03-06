package com.mangosoftware.motorCloud.Model.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mangosoftware.motorCloud.Model.Entity.Vehiculo;

@Repository
public interface iVehiculoRepository extends JpaRepository<Vehiculo, Long> {

    // Obtener Vehiculo por Estado
    List<Vehiculo> findByStatus(Boolean status);

    // Obtener Vehiculos por ID de Cliente
    List<Vehiculo> findByClienteId(Long clienteId);

}
