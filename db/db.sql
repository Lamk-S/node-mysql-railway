CREATE DATABASE IF NOT EXISTS PRUEBA_ANEMIA;
USE PRUEBA_ANEMIA;

-- Crear la tabla usuario
CREATE TABLE usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    dni CHAR(60) NOT NULL
);

-- Crear la tabla registro
CREATE TABLE registro (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    dni CHAR(8) NOT NULL,
    nombre_apellido VARCHAR(30) NOT NULL,
    edad INT NOT NULL,
    peso DECIMAL(5,2) NULL,
    altura DECIMAL(5,2) NULL,
    sexo ENUM('M', 'F') NOT NULL,
    hmg DECIMAL(5,2) NOT NULL,
    RBC DECIMAL(5,2) NULL,
    MCH DECIMAL(5,2) NULL,
    TLC FLOAT NULL,
    PLT FLOAT NULL,
    MCHC DECIMAL(5,2) NULL,
    RDW DECIMAL(5,2) NULL,
    PCV DECIMAL(5,2) NULL,
    MCV DECIMAL(5,2) NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo_prediccion int NOT NULL,
    resultado varchar(50) NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);