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

    private String ciudad;

    private String provincia;

    @NotBlank(message = "La dirección es obligatoria")
    @Column(nullable = false)
    private String direccion;

    /**
     * Monotributo, Responsable Inscripto, etc.
     */
    @Column(name = "categoria_fiscal", nullable = false, unique = true)
    private String categoriaFiscal;

    /**
     * Almacena la URL o ruta del logo.
     */
    @Column(name = "logo_path")
    private String logoPath;

    /**
     * Almacena las reparaciones Totales sumando los trabajos realizados en la
     * empresa * para mostrar en el Dashboard y también en el Landing Page.
     *
     * Este campo se actualizará cada vez que se cree o actualice una orden de
     * trabajo, sumando el total de la orden al campo reparacionesTotales.
     */
    @Column(name = "reparaciones_totales")
    private Double reparacionesTotales;

    /**
     * Almacena la cantidad de años de experiencia de la empresa, para mostrar en el
     * Dashboard y también en el Landing Page.
     *
     * El usuario ingresará un valor base y este debera ir actualizandose cada año,
     * sumando 1 al campo añosExperiencia.
     */
    @Column(name = "anos_experiencia")
    private Integer anosExperiencia;

    /**
     * Almacena la cantidad de clientes sastifechos, para mostrar en el Dashboard y
     * también en el Landing Page.
     *
     * Este campo se actualizará cada vez que se cierre una orden de trabajo,
     * sumando 1 al campo clientesSastifechos.
     */
    @Column(name = "clientes_sastifechos")
    private Integer clientesSastifechos;

    /**
     * Almacena los horarios de atención de la empresa, para mostrar en el Dashboard
     * y también en el Landing Page. El usuario ingresará un valor base y este se mostrará tal cual en el
     * Frontend.
     */
    @Column(name = "horario_atencion")
    private String horarioAtencion;

}
