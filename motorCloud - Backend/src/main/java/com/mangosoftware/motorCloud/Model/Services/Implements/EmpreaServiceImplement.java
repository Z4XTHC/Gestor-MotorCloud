package com.mangosoftware.motorCloud.Model.Services.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mangosoftware.motorCloud.Model.Entity.Empresa;
import com.mangosoftware.motorCloud.Model.Repository.iEmpresaRepository;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iEmpresaService;

@Service
public class EmpreaServiceImplement implements iEmpresaService {

    @Autowired
    private iEmpresaRepository empresaRepository;

    @Override
    public Empresa getEmpresaUnica() {
        return empresaRepository.findById(1L).orElse(null);
    }

    @Override
    public Empresa updateEmpresa(Long id, Empresa empresa) {
        Empresa existingEmpresa = empresaRepository.findById(id).orElse(null);
        if (existingEmpresa != null) {
            existingEmpresa.setRazonSocial(empresa.getRazonSocial());
            existingEmpresa.setDatosFiscal(empresa.getDatosFiscal());
            existingEmpresa.setTelefono(empresa.getTelefono());
            existingEmpresa.setEmail(empresa.getEmail());
            existingEmpresa.setDireccion(empresa.getDireccion());
            return empresaRepository.save(existingEmpresa);
        }
        return null;
    }

}
