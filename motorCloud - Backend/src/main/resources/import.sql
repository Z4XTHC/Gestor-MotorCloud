-- USUARIO PREDETERMINADO
INSERT INTO usuarios (`nombre`, `password`, `rol`, `status`, `username`) VALUES ('Administrador', '$2a$12$cAeGE2eL7rfWi3LQC16ycebZKWEqX87NzXcA6IM3omF8mtDVbyJWm', 'ADMIN',1, 'admin'), ('Usuario', '$2a$12$kj9HeZ8iJGLr3G8kzDYy7.F/v4kJBuooX8UlPCB7K6HqZKIli0ub6', 'USER', 1, 'user');

-- INFO EMPRESA PREDETERMINADA
INSERT INTO empresas (
    id, 
    razon_social, 
    datos_fiscal, 
    telefono, 
    email, 
    ciudad, 
    provincia, 
    direccion, 
    categoria_fiscal, 
    logo_path
) 
VALUES (
    1, 
    'Motor Cloud', 
    '20-12345678-0', 
    '362-5123456', 
    'info@motorcloud.com', 
    'Barranqueras', 
    'Chaco', 
    'Calle Principal 123', 
    'Responsable Monotributo', 
    '/path/to/logo.png'
);