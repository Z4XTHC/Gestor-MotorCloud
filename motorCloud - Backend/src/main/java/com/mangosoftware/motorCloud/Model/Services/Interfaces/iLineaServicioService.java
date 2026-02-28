package com.mangosoftware.motorCloud.Model.Services.Interfaces;

import java.util.List;

import com.mangosoftware.motorCloud.Model.Entity.LineaServicio;

public interface iLineaServicioService {

    public List<LineaServicio> getAllLineasServicio();

    public LineaServicio getLineaServicioById(Long id);

    public LineaServicio createLineaServicio(LineaServicio lineaServicio);

    public LineaServicio updateLineaServicio(Long id, LineaServicio lineaServicio);

    public void deleteLineaServicio(Long id);

}
