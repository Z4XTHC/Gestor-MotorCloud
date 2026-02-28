package com.mangosoftware.motorCloud.Model.Services.Implements;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mangosoftware.motorCloud.Model.Entity.Usuario;
import com.mangosoftware.motorCloud.Model.Repository.iUsuarioRepository;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iUsuarioService;

@Service
public class UsuarioServiceImplent implements iUsuarioService {

    @Autowired
    private iUsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Override
    public Usuario createUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario updateUsuario(Long id) {
        Usuario existingUsuario = usuarioRepository.findById(id).orElse(null);
        if (existingUsuario != null) {
            existingUsuario.setNombre(existingUsuario.getNombre());
            existingUsuario.setApellido(existingUsuario.getApellido());
            existingUsuario.setUsername(existingUsuario.getUsername());
            existingUsuario.setPassword(existingUsuario.getPassword());
            existingUsuario.setRol(existingUsuario.getRol());
            return usuarioRepository.save(existingUsuario);
        }
        return null;
    }

    @Override
    public void deleteUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario changeStatus(Long id, Boolean status) {
        Usuario existingUsuario = usuarioRepository.findById(id).orElse(null);
        if (existingUsuario != null) {
            existingUsuario.setStatus(status);
            return usuarioRepository.save(existingUsuario);
        }
        return null;
    }

    @Override
    public List<Usuario> getUsuariosByStatus(Boolean status) {
        return usuarioRepository.findByStatus(status);
    }

    @Override
    public Usuario updatePassword(Long id, String newPassword) {
        Usuario existingUsuario = usuarioRepository.findById(id).orElse(null);
        if (existingUsuario != null) {
            existingUsuario.setPassword(newPassword);
            return usuarioRepository.save(existingUsuario);
        }
        return null;
    }

    @Override
    public boolean existsByUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

}
