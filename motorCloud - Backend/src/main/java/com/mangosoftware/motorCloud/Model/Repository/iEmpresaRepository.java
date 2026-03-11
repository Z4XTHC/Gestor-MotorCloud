package com.mangosoftware.motorCloud.Model.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mangosoftware.motorCloud.Model.Entity.Empresa;

@Repository
public interface iEmpresaRepository extends JpaRepository<Empresa, Long> {

}
