package com.mangosoftware.motorCloud.Model.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mangosoftware.motorCloud.Model.Entity.Usuario;

@Repository
public interface iUsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // ObtenerUsuarioPorEstado
    List<Usuario> findByStatus(Boolean status);

    // Verificar si el usuario existe por username
    boolean existsByUsername(String username);
}
