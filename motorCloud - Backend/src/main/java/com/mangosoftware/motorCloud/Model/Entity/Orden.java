package com.mangosoftware.motorCloud.Model.Entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa una orden de servicio en el sistema de gestión de taller mecánico.
 * Contiene información sobre la orden, como número, fechas, descripción,
 * estado,
 * total, y relaciones con el vehículo, usuario y líneas de servicio asociadas.
 * La clase incluye un método para actualizar el total sumando los importes de
 * las
 * líneas de servicio, que debe ser llamado antes de guardar la orden.
 * Las relaciones con otras entidades permiten gestionar la información de
 * manera estructurada y eficiente.
 * 
 * @author Mangosoftware
 * @version 1.0
 */

@Entity
@Table(name = "ordenes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroOrden;

    private LocalDate fechaCreacion;

    private LocalDate fechaEntrega;

    private String descripcion;

    private String estado;

    private Double total;

    @ManyToOne
    @JoinColumn(name = "vehiculo_id")
    private Vehiculo vehiculo; // Relación con la entidad Vehiculo, indicando el vehículo asociado a la orden

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // Relación con la entidad Usuario, indicando el usuario que creó la orden

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<LineaServicio> lineasServicio; // Relación con la entidad LineaServicio, indicando las líneas de
                                                // servicio asociadas a la orden

    // Actualiza el total sumando los importes de las lineas; llamar antes de
    // guardar
    public void actualizarTotal() {
        this.total = lineasServicio.stream()
                .mapToDouble(ls -> ls.getPrecio() == null ? 0.0 : ls.getPrecio())
                .sum();
    }

    private Boolean status;
}
