CREATE TABLE categorias(

    id_categoria INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    descripcion TEXT,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_compra DECIMAL(10 , 2 ),
    precio_venta DECIMAL(10 , 2 ),
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 5,
    estado BOOLEAN DEFAULT TRUE,
    id_categoria INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria)
        REFERENCES categorias (id_categoria)
);