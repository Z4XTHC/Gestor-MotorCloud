package com.mangosoftware.motorCloud.Model.Services.Implements;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mangosoftware.motorCloud.Model.Entity.LineaServicio;
import com.mangosoftware.motorCloud.Model.Entity.Orden;
import com.mangosoftware.motorCloud.Model.Repository.iOrdenRepository;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iOrdenService;

@Service
public class OrdenServiceImplement implements iOrdenService {

    @Autowired
    private iOrdenRepository ordenRepository;

    @Override
    public List<Orden> getAllOrdenes() {
        return ordenRepository.findAll();
    }

    @Override
    public Orden getOrdenById(Long id) {
        return ordenRepository.findById(id).orElse(null);
    }

    @Override
    public Orden createOrden(Orden orden) {
        // Establecer la referencia bidirecional en cada línea de servicio
        if (orden.getLineasServicio() != null) {
            for (LineaServicio ls : orden.getLineasServicio()) {
                ls.setOrden(orden);
            }
        }
        // Calcular total antes de guardar
        if (orden.getLineasServicio() != null && !orden.getLineasServicio().isEmpty()) {
            orden.actualizarTotal();
        } else {
            orden.setTotal(0.0);
        }
        return ordenRepository.save(orden);
    }

    @Override
    public Orden updateOrden(Long id, Orden orden) {
        Orden existingOrden = ordenRepository.findById(id).orElse(null);
        if (existingOrden != null) {
            existingOrden.setDescripcion(orden.getDescripcion());
            existingOrden.setFechaEntrega(orden.getFechaEntrega());
            existingOrden.setFechaCreacion(orden.getFechaCreacion());
            existingOrden.setStatus(orden.getStatus());
            existingOrden.setTotal(orden.getTotal());
            existingOrden.setVehiculo(orden.getVehiculo());
            existingOrden.setUsuario(orden.getUsuario());
            existingOrden.setLineasServicio(orden.getLineasServicio());
            existingOrden.setNumeroOrden(orden.getNumeroOrden());
            existingOrden.actualizarTotal();
            return ordenRepository.save(existingOrden);
        }
        return null;
    }

    @Override
    public void deleteOrden(Long id) {
        if (ordenRepository.existsById(id)) {
            ordenRepository.deleteById(id);
        }
    }

    @Override
    public Orden changeStatus(Long id, Boolean status) {
        if (ordenRepository.existsById(id)) {
            Orden orden = ordenRepository.findById(id).orElse(null);
            if (orden != null) {
                orden.setStatus(status);
                return ordenRepository.save(orden);
            }
        }
        return null;
    }

    @Override
    public List<Orden> getOrdenesByStatus(Boolean status) {
        return ordenRepository.findByStatus(status);
    }

}
