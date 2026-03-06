package com.mangosoftware.motorCloud.Model.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa una línea de servicio en el sistema de gestión de taller mecánico.
 * Contiene información sobre la descripción del servicio, el precio y la
 * relación
 * con la orden a la que pertenece. La clase incluye anotaciones de JPA para
 * mapearla a una tabla en la base de datos, y utiliza Lombok para generar
 * automáticamente los métodos getters, setters, constructores y otros métodos
 * comunes.
 * 
 * @author Mangosoftware
 * @version 1.0
 */

@Entity
@Table(name = "lineas_servicio")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LineaServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;

    @JsonIgnoreProperties({ "lineasServicio", "vehiculo", "usuario" })
    @ManyToOne
    @JoinColumn(name = "orden_id", nullable = false)
    private Orden orden;

    private Double precio;
}