package com.mangosoftware.motorCloud.Model.Services.Implements;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mangosoftware.motorCloud.Model.Entity.Inventario;
import com.mangosoftware.motorCloud.Model.Repository.iInventarioRepository;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iInventarioService;

@Service
public class InventarioServiceImplement implements iInventarioService {

    @Autowired
    private iInventarioRepository inventarioRepository;

    @Override
    public List<Inventario> getAllInventarios() {
        return inventarioRepository.findAll();
    }

    @Override
    public Inventario getInventarioById(Long id) {
        return inventarioRepository.findById(id).orElse(null);
    }

    @Override
    public Inventario createInventario(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    @Override
    public Inventario updateInventario(Long id, Inventario inventario) {
        Inventario existingInventario = inventarioRepository.findById(id).orElse(null);
        if (existingInventario != null) {
            existingInventario.setNombre(inventario.getNombre());
            existingInventario.setDescripcion(inventario.getDescripcion());
            existingInventario.setCantidad(inventario.getCantidad());
            existingInventario.setPrecio(inventario.getPrecio());
            return inventarioRepository.save(existingInventario);
        }
        return null;
    }

    @Override
    public void deleteInventario(Long id) {
        inventarioRepository.deleteById(id);
    }

    @Override
    public Inventario changeStatus(Long id, Boolean status) {
        Inventario existingInventario = inventarioRepository.findById(id).orElse(null);
        if (existingInventario != null) {
            existingInventario.setStatus(status);
            return inventarioRepository.save(existingInventario);
        }
        return null;
    }

    @Override
    public List<Inventario> getInventariosByStatus(Boolean status) {
        return inventarioRepository.findByStatus(status);
    }

    @Override
    public boolean existsByNombre(String nombre) {
        return inventarioRepository.existsByNombre(nombre);
    }

}
