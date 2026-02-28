package com.mangosoftware.motorCloud.Model.Services.Implements;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mangosoftware.motorCloud.Model.Entity.LineaServicio;
import com.mangosoftware.motorCloud.Model.Repository.iLineaServicioRepository;
import com.mangosoftware.motorCloud.Model.Services.Interfaces.iLineaServicioService;

@Service
public class LineaServicioServiceImplement implements iLineaServicioService {

    @Autowired
    private iLineaServicioRepository lineaServicioRepository;

    @Override
    public List<LineaServicio> getAllLineasServicio() {
        return lineaServicioRepository.findAll();
    }

    @Override
    public LineaServicio getLineaServicioById(Long id) {
        return lineaServicioRepository.findById(id).orElse(null);
    }

    @Override
    public LineaServicio createLineaServicio(LineaServicio lineaServicio) {
        return lineaServicioRepository.save(lineaServicio);
    }

    @Override
    public LineaServicio updateLineaServicio(Long id, LineaServicio lineaServicio) {
        LineaServicio existingLineaServicio = lineaServicioRepository.findById(id).orElse(null);
        if (existingLineaServicio != null) {
            existingLineaServicio.setDescripcion(lineaServicio.getDescripcion());
            existingLineaServicio.setPrecio(lineaServicio.getPrecio());
            return lineaServicioRepository.save(existingLineaServicio);
        }
        return null;
    }

    @Override
    public void deleteLineaServicio(Long id) {
        if (lineaServicioRepository.existsById(id)) {
            lineaServicioRepository.deleteById(id);
        }
    }

}
