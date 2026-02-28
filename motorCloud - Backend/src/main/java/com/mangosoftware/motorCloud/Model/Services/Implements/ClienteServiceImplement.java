package com.mangosoftware.motorCloud.Model.Services.Implements;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mangosoftware.motorCloud.Model.Entity.Cliente;
import com.mangosoftware.motorCloud.Model.Repository.iClienteRepository;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iClienteService;

@Service
public class ClienteServiceImplement implements iClienteService {

    @Autowired
    private iClienteRepository clienteRepository;

    @Override
    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente getClienteById(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @Override
    public Cliente createCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente updateCliente(Long id, Cliente cliente) {
        Cliente existingCliente = clienteRepository.findById(id).orElse(null);
        if (existingCliente != null) {
            existingCliente.setNombre(cliente.getNombre());
            existingCliente.setApellido(cliente.getApellido());
            existingCliente.setEmail(cliente.getEmail());
            existingCliente.setTelefono(cliente.getTelefono());
            existingCliente.setDireccion(cliente.getDireccion());
            return clienteRepository.save(existingCliente);
        }
        return null;
    }

    @Override
    public void deleteCliente(Long id) {
        clienteRepository.deleteById(id);
    }

    @Override
    public Cliente changeStatus(Long id, Boolean status) {
        Cliente existingCliente = clienteRepository.findById(id).orElse(null);
        if (existingCliente != null) {
            existingCliente.setStatus(status);
            return clienteRepository.save(existingCliente);
        }
        return null;
    }

    @Override
    public List<Cliente> getClientesByStatus(Boolean status) {
        return clienteRepository.findByStatus(status);
    }

    @Override
    public boolean exitsByDni(String dni) {
        return clienteRepository.existsByDni(dni);
    }

}
