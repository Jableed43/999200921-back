-- ============================================
-- COMISIÓN 921 - PASO 1: Crear DB y Tablas
-- ============================================
-- Objetivo: Crear base de datos, tablas estudiantes y materias
--          con 30 estudiantes y 30 materias para practicar
--          
-- IMPORTANTE: Este script incluye primero los datos originales de la clase anterior
--             (Javier, Matias, Theo, Angel y las 4 materias originales)
--             Luego añade más datos hasta llegar a 30 estudiantes y 30 materias
--
-- LISTO PARA COPIAR Y PEGAR EN MYSQL WORKBENCH

CREATE DATABASE IF NOT EXISTS `universidad2` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `universidad2`;

-- Eliminar tablas si existen (para empezar limpio)
DROP TABLE IF EXISTS `inscripciones`;
DROP TABLE IF EXISTS `estudiante`;
DROP TABLE IF EXISTS `materia`;

-- Crear tabla estudiante
CREATE TABLE `estudiante` (
  `idestudiante` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `fechaNacimiento` DATE NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idestudiante`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Crear tabla materia
CREATE TABLE `materia` (
  `idmateria` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (`idmateria`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar estudiantes (primero los originales, luego más hasta llegar a 30)
INSERT INTO `estudiante` (`nombre`, `apellido`, `email`, `fechaNacimiento`) VALUES
-- Estudiantes originales de la clase anterior
('Javier', 'Lopez', 'jlopez@gmail.com', '1992-09-10'),
('Matias', 'Riera', 'matr@gmail.com', '1991-06-24'),
('Theo', 'Saravia', 'theosaravia@gmail.com', '2005-06-13'),
('Angel', 'Raddino', 'angelRaddino@gmail.com', '2005-08-15'),
-- Estudiantes adicionales para llegar a 30
('Sofia', 'Martinez', 'sofia.martinez@email.com', '2000-03-15'),
('Lucas', 'Garcia', 'lucas.garcia@email.com', '1999-07-22'),
('Valentina', 'Rodriguez', 'valentina.rodriguez@email.com', '2001-11-08'),
('Mateo', 'Fernandez', 'mateo.fernandez@email.com', '2002-01-30'),
('Isabella', 'Lopez', 'isabella.lopez@email.com', '2000-05-18'),
('Santiago', 'Gonzalez', 'santiago.gonzalez@email.com', '1998-09-12'),
('Camila', 'Perez', 'camila.perez@email.com', '2001-12-25'),
('Nicolas', 'Sanchez', 'nicolas.sanchez@email.com', '1999-04-07'),
('Martina', 'Torres', 'martina.torres@email.com', '2002-08-14'),
('Sebastian', 'Ramirez', 'sebastian.ramirez@email.com', '2000-02-28'),
('Lucia', 'Flores', 'lucia.flores@email.com', '2001-10-05'),
('Diego', 'Morales', 'diego.morales@email.com', '1999-06-20'),
('Emma', 'Rivera', 'emma.rivera@email.com', '2002-03-11'),
('Benjamin', 'Ortiz', 'benjamin.ortiz@email.com', '2000-07-09'),
('Olivia', 'Vargas', 'olivia.vargas@email.com', '2001-09-16'),
('Maximo', 'Castro', 'maximo.castro@email.com', '1998-11-23'),
('Amelia', 'Reyes', 'amelia.reyes@email.com', '2002-01-04'),
('Tomas', 'Jimenez', 'tomas.jimenez@email.com', '1999-08-17'),
('Mia', 'Herrera', 'mia.herrera@email.com', '2001-05-29'),
('Agustin', 'Ruiz', 'agustin.ruiz@email.com', '2000-12-13'),
('Catalina', 'Diaz', 'catalina.diaz@email.com', '2002-04-26'),
('Joaquin', 'Moreno', 'joaquin.moreno@email.com', '1999-10-02'),
('Victoria', 'Alvarez', 'victoria.alvarez@email.com', '2001-07-19'),
('Ignacio', 'Gutierrez', 'ignacio.gutierrez@email.com', '2000-03-31'),
('Antonella', 'Silva', 'antonella.silva@email.com', '2002-06-08'),
('Facundo', 'Romero', 'facundo.romero@email.com', '1998-09-21');

-- Insertar materias (primero las originales, luego más hasta llegar a 30)
INSERT INTO `materia` (`nombre`, `codigo`) VALUES
-- Materias originales de la clase anterior
('Programación I', 'PROG1'),
('Base de Datos', 'BD1'),
('Matemática', 'MAT1'),
('Inglés', 'ING1'),
-- Materias adicionales para llegar a 30
('Programación II', 'PROG2'),
('Estructuras de Datos', 'ED1'),
('Algoritmos', 'ALG1'),
('Sistemas Operativos', 'SO1'),
('Redes de Computadoras', 'RED1'),
('Arquitectura de Computadoras', 'ARQ1'),
('Ingeniería de Software', 'IS1'),
('Bases de Datos Avanzadas', 'BD2'),
('Programación Web', 'PW1'),
('Desarrollo Mobile', 'DM1'),
('Inteligencia Artificial', 'IA1'),
('Seguridad Informática', 'SI1'),
('Cálculo I', 'CAL1'),
('Cálculo II', 'CAL2'),
('Álgebra Lineal', 'AL1'),
('Estadística', 'EST1'),
('Física I', 'FIS1'),
('Física II', 'FIS2'),
('Inglés Técnico', 'ING2'),
('Comunicación', 'COM1'),
('Ética Profesional', 'ETI1'),
('Proyecto Integrador I', 'PI1'),
('Proyecto Integrador II', 'PI2'),
('Prácticas Profesionales', 'PP1'),
('Seminario de Tesis', 'ST1'),
('Emprendimiento Tecnológico', 'ET1');

-- Verificar datos insertados
SELECT COUNT(*) as total_estudiantes FROM estudiante;
SELECT COUNT(*) as total_materias FROM materia;

