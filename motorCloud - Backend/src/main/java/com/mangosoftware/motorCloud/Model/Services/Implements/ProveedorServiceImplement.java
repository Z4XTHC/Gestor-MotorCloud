package com.mangosoftware.motorCloud.Model.Services.Implements;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mangosoftware.motorCloud.Model.Entity.Proveedor;
import com.mangosoftware.motorCloud.Model.Repository.iProveedorRepository;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iProveedorService;

@Service
public class ProveedorServiceImplement implements iProveedorService {

    @Autowired
    private iProveedorRepository proveedorRepository;

    @Override
    public List<Proveedor> getAllProveedores() {
        return proveedorRepository.findAll();
    }

    @Override
    public Proveedor getProveedorById(Long id) {
        return proveedorRepository.findById(id).orElse(null);
    }

    @Override
    public Proveedor createProveedor(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    @Override
    public Proveedor updateProveedor(Long id, Proveedor proveedor) {
        Proveedor existingProveedor = proveedorRepository.findById(id).orElse(null);
        if (existingProveedor != null) {
            existingProveedor.setRazonSocial(proveedor.getRazonSocial());
            existingProveedor.setCuit(proveedor.getCuit());
            existingProveedor.setDireccion(proveedor.getDireccion());
            existingProveedor.setTelefono(proveedor.getTelefono());
            existingProveedor.setEmail(proveedor.getEmail());
            return proveedorRepository.save(existingProveedor);
        }
        return null;
    }

    @Override
    public void deleteProveedor(Long id) {
        proveedorRepository.deleteById(id);
    }

    @Override
    public Proveedor changeStatus(Long id, Boolean status) {
        Proveedor existingProveedor = proveedorRepository.findById(id).orElse(null);
        if (existingProveedor != null) {
            existingProveedor.setStatus(status);
            return proveedorRepository.save(existingProveedor);
        }
        return null;
    }

    @Override
    public List<Proveedor> getProveedoresByStatus(Boolean status) {
        return proveedorRepository.findByStatus(status);
    }

    @Override
    public boolean existsByCuit(String cuit) {
        return proveedorRepository.existsByCuit(cuit);
    }

}
