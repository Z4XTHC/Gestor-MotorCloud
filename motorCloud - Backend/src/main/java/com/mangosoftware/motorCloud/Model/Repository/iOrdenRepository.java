package com.mangosoftware.motorCloud.Model.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mangosoftware.motorCloud.Model.Entity.Orden;

@Repository
public interface iOrdenRepository extends JpaRepository<Orden, Long> {

    // Buscar Ordenes por Estado
    List<Orden> findByStatus(Boolean status);

}
