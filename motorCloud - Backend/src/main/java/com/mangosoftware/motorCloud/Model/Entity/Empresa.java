package com.mangosoftware.motorCloud.Model.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * La entidad EMPRESA se encarga de almacenar la información de la empresa, como
 * su razón social, datos fiscales, teléfono, email y dirección.
 * El cual sera utilizado para la configuración del Frontend (Motor Cloud)
 * permitiendo a los usuarios visualizar la información de su empresa en la
 * aplicación.
 * 1. para la información de contacto desde en Landing Page y en el Footer de la
 * aplicación.
 * 2. para los datos de facturación.
 * 3. para la personalización de la aplicación, mostrando el nombre y logo de la
 * empresa en lugar de un nombre genérico.
 * 4. para las ordenes de trabajo, permitiendo a los usuarios asociar las
 * órdenes con la empresa correspondiente.
 * 
 * @author Mangosoftware
 * @version 1.0
 */
@Entity
@Table(name = "empresas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La razón social es obligatoria")
    @Column(nullable = false)
    private String razonSocial;

    /**
     * DNI, CUIL o CUIT.
     * Sugerencia: Mantenerlo como String para soportar guiones si es necesario.
     */
    @NotBlank(message = "El dato fiscal es obligatorio")
    @Column(name = "datos_fiscal", nullable = false, unique = true)
    private String datosFiscal;

    private String telefono;

    @Email(message = "El formato del email no es válido")
    private String email;

    private String direccion;

    /**
     * Monotributo, Responsable Inscripto, etc.
     */
    private String categoriaFiscal;

    /**
     * Almacena la URL o ruta del logo.
     */
    private String logoPath;

}
