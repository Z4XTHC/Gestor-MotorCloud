package com.mangosoftware.motorCloud.Model.Entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa un cliente en el sistema de gestión de taller mecánico.
 * Contiene información sobre el cliente, como nombre, email, teléfono,
 * dirección y DNI.
 * Además, mantiene una relación con los vehículos asociados al cliente.
 * La clase incluye anotaciones de JPA para mapearla a una tabla en la base de
 * datos,
 * y utiliza Lombok para generar automáticamente los métodos getters, setters,
 * constructores y otros métodos comunes.
 * 
 * @author Mangosoftware
 * @version 1.0
 */

@Entity
@Table(name = "clientes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String apellido;

    private String email;

    private String telefono;

    private String direccion;

    private String dni;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Vehiculo> vehiculos; // Relación con la entidad Vehiculo, indicando los vehículos asociados al
                                      // cliente

    private Boolean status;
}
