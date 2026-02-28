package com.mangosoftware.motorCloud.Model.Services.Implements;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mangosoftware.motorCloud.Model.Entity.Vehiculo;
import com.mangosoftware.motorCloud.Model.Repository.iVehiculoRepository;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iVehiculoService;

@Service
public class VehiculoServiceImplement implements iVehiculoService {

    @Autowired
    private iVehiculoRepository vehiculoRepository;

    @Override
    public List<Vehiculo> getAllVehiculos() {
        return vehiculoRepository.findAll();
    }

    @Override
    public Vehiculo getVehiculoById(Long id) {
        return vehiculoRepository.findById(id).orElse(null);
    }

    @Override
    public Vehiculo createVehiculo(Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }

    @Override
    public Vehiculo updateVehiculo(Long id, Vehiculo vehiculo) {
        Vehiculo existingVehiculo = vehiculoRepository.findById(id).orElse(null);
        if (existingVehiculo != null) {
            existingVehiculo.setMarca(vehiculo.getMarca());
            existingVehiculo.setModelo(vehiculo.getModelo());
            existingVehiculo.setAnio(vehiculo.getAnio());
            existingVehiculo.setColor(vehiculo.getColor());
            existingVehiculo.setPatente(vehiculo.getPatente());
            return vehiculoRepository.save(existingVehiculo);
        }
        return null;
    }

    @Override
    public void deleteVehiculo(Long id) {
        vehiculoRepository.deleteById(id);
    }

    @Override
    public Vehiculo changeStatus(Long id, Boolean status) {
        Vehiculo existingVehiculo = vehiculoRepository.findById(id).orElse(null);
        if (existingVehiculo != null) {
            existingVehiculo.setStatus(status);
            return vehiculoRepository.save(existingVehiculo);
        }
        return null;
    }

    @Override
    public List<Vehiculo> getVehiculosByStatus(Boolean status) {
        return vehiculoRepository.findByStatus(status);
    }
    

}
