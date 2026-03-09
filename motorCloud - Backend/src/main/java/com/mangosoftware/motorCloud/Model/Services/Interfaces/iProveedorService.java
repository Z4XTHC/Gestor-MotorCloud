package com.mangosoftware.motorCloud.Model.Services.Interfaces;

import java.util.List;

import com.mangosoftware.motorCloud.Model.Entity.Proveedor;

public interface iProveedorService {

    public List<Proveedor> getAllProveedores();

    public Proveedor getProveedorById(Long id);

    public Proveedor createProveedor(Proveedor proveedor);

    public Proveedor updateProveedor(Long id, Proveedor proveedor);

    public void deleteProveedor(Long id);

    public Proveedor changeStatus(Long id, Boolean status);

    public List<Proveedor> getProveedoresByStatus(Boolean status);

    public boolean existsByCuit(String cuit);

}
