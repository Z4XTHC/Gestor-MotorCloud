package com.mangosoftware.motorCloud.Model.Services.Interfaces;

import com.mangosoftware.motorCloud.Model.Entity.Empresa;

public interface iEmpresaService {

    public Empresa getEmpresaUnica();

    public Empresa updateEmpresa(Long id, Empresa empresa);

}
