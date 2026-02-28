package com.mangosoftware.motorCloud.Model.Services.Interfaces;

import java.util.List;

import com.mangosoftware.motorCloud.Model.Entity.Cliente;

public interface iClienteService {

    public List<Cliente> getAllClientes();

    public Cliente getClienteById(Long id);

    public Cliente createCliente(Cliente cliente);

    public Cliente updateCliente(Long id, Cliente cliente);

    public void deleteCliente(Long id);

    public Cliente changeStatus(Long id, Boolean status);

    public List<Cliente> getClientesByStatus(Boolean status);

    public boolean exitsByDni(String dni);
}
