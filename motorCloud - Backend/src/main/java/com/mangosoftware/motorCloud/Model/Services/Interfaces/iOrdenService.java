package com.mangosoftware.motorCloud.Model.Services.Interfaces;

import java.util.List;

import com.mangosoftware.motorCloud.Model.Entity.Orden;

public interface iOrdenService {

    public List<Orden> getAllOrdenes();

    public Orden getOrdenById(Long id);

    public Orden createOrden(Orden orden);

    public Orden updateOrden(Long id, Orden orden);

    public void deleteOrden(Long id);

    public Orden changeStatus(Long id, Boolean status);

    public List<Orden> getOrdenesByStatus(Boolean status);

}
