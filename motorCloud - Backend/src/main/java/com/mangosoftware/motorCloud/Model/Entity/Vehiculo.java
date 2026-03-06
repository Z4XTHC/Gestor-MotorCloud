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
 * Representa un vehículo en el sistema de gestión de taller mecánico.
 * Contiene información sobre el vehículo, como marca, modelo, año, color y
 * patente.
 * Además, mantiene una relación con el cliente propietario del vehículo.
 * La clase incluye anotaciones de JPA para mapearla a una tabla en la base de
 * datos, y utiliza Lombok para generar automáticamente los métodos getters,
 * setters,
 * constructores y otros métodos comunes.
 * 
 * @author Mangosoftware
 * @version 1.0
 */

@Entity
@Table(name = "vehiculos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String marca;

    private String modelo;

    private Integer anio;

    private String color;

    private String patente;

    @JsonIgnoreProperties({ "vehiculos", "ordenes" })
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente; // Relación con la entidad Cliente, indicando el propietario del vehículo

    private Boolean status;
}
