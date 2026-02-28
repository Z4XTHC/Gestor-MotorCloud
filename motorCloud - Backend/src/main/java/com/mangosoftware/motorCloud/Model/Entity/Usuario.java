package com.mangosoftware.motorCloud.Model.Entity;

import com.mangosoftware.motorCloud.Model.Enum.Rol;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Representa un usuario en el sistema de gestión de taller mecánico.
 * Contiene información sobre el usuario, como nombre de usuario, contraseña y rol.
 * La clase incluye anotaciones de JPA para mapearla a una tabla en la base
 * de datos, y utiliza Lombok para generar automáticamente los métodos getters, setters,
 * constructores y otros métodos comunes.
 * 
 * @author Mangosoftware
 * @version 1.0
 */

@Entity
@Table(name = "usuarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String apellido;

    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    private Boolean status;
}
