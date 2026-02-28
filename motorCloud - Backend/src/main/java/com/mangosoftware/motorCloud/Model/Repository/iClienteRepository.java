package com.mangosoftware.motorCloud.Model.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mangosoftware.motorCloud.Model.Entity.Cliente;

@Repository
public interface iClienteRepository extends JpaRepository<Cliente, Long> {

    // Obtener cliente por Estado
    List<Cliente> findByStatus(Boolean status);

    // Verificar si el cliente existe por DNI
    boolean existsByDni(String dni);


}
