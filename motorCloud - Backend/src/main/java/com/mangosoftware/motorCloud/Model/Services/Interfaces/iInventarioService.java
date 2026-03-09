package com.mangosoftware.motorCloud.Model.Services.Interfaces;

import java.util.List;

import com.mangosoftware.motorCloud.Model.Entity.Inventario;

public interface iInventarioService {

    public List<Inventario> getAllInventarios();

    public Inventario getInventarioById(Long id);

    public Inventario createInventario(Inventario inventario);

    public Inventario updateInventario(Long id, Inventario inventario);

    public void deleteInventario(Long id);

    public Inventario changeStatus(Long id, Boolean status);

    public List<Inventario> getInventariosByStatus(Boolean status);

    public boolean existsByNombre(String nombre);

    public boolean existsByCodigo(String codigo);

}
