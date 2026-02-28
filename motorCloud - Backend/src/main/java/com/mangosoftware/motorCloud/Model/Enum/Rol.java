package com.mangosoftware.motorCloud.Model.Enum;

/**
 * Enum que representa los roles de usuario en el sistema.
 * Puede ser ADMIN para usuarios con privilegios administrativos o USER para
 * usuarios regulares.
 * Este enum se utiliza para asignar roles a los usuarios y controlar el acceso
 * a diferentes funcionalidades del sistema.
 * Estara relacionado con la entidad Usuario, donde cada usuario tendrá un rol
 * asignado que determinará sus permisos
 * y acciones dentro de la aplicación.
 * 
 * @author Mangosoftware
 * @version 1.0
 */

public enum Rol {
    ADMIN,
    USER
}
