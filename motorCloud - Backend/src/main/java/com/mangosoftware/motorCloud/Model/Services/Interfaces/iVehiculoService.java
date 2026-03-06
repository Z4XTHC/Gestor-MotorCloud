package com.mangosoftware.motorCloud.Model.Services.Interfaces;

import java.util.List;

import com.mangosoftware.motorCloud.Model.Entity.Vehiculo;

public interface iVehiculoService {

    public List<Vehiculo> getAllVehiculos();

    public Vehiculo getVehiculoById(Long id);

    public Vehiculo createVehiculo(Vehiculo vehiculo);

    public Vehiculo updateVehiculo(Long id, Vehiculo vehiculo);

    public void deleteVehiculo(Long id);

    public Vehiculo changeStatus(Long id, Boolean status);

    public List<Vehiculo> getVehiculosByStatus(Boolean status);

    public List<Vehiculo> getVehiculosByClienteId(Long clienteId);

}
