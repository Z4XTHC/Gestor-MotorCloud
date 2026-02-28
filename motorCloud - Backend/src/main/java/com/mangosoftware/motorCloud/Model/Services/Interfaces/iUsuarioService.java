package com.mangosoftware.motorCloud.Model.Services.Interfaces;

import java.util.List;

import com.mangosoftware.motorCloud.Model.Entity.Usuario;

public interface iUsuarioService {

    public List<Usuario> getAllUsuarios();

    public Usuario getUsuarioById(Long id);

    public Usuario createUsuario(Usuario usuario);

    public Usuario updateUsuario(Long id);

    public void deleteUsuario(Long id);

    public Usuario changeStatus(Long id, Boolean status);

    public List<Usuario> getUsuariosByStatus(Boolean status);

    public Usuario updatePassword(Long id, String newPassword);

    public boolean existsByUsername(String username);

}
