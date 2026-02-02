-- ============================================
-- COMISIÓN 921 - PASO 4: Agregar Tabla Docentes
-- ============================================
-- Objetivo: Crear tabla docentes y relacionarla con materias
--          Relación 1:N: Un docente puede dictar muchas materias
--          
-- IMPORTANTE: Ejecutar después de paso1, paso2 y paso3
--             Este script añade la tabla docentes y actualiza materias
--
-- LISTO PARA COPIAR Y PEGAR EN MYSQL WORKBENCH

USE `universidad2`;

-- ============================================
-- CONFIGURACIÓN: Deshabilitar Safe Updates
-- ============================================
-- MySQL Workbench tiene "Safe Updates" activado por defecto para prevenir
-- UPDATE/DELETE accidentales. Este script necesita deshabilitarlo temporalmente
-- porque los UPDATE usan condiciones LIKE y operaciones matemáticas que no
-- usan índices directamente.
--
-- ⚠️ IMPORTANTE: Se restaura al final del script para mantener la seguridad

SET SQL_SAFE_UPDATES = 0;

-- ============================================
-- CREAR TABLA DOCENTES
-- ============================================

CREATE TABLE IF NOT EXISTS `docentes` (
  `iddocente` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `especialidad` VARCHAR(100) DEFAULT NULL,
  `fecha_ingreso` DATE DEFAULT NULL,
  PRIMARY KEY (`iddocente`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- INSERTAR DOCENTES DE EJEMPLO
-- ============================================

INSERT INTO `docentes` (`nombre`, `apellido`, `email`, `especialidad`, `fecha_ingreso`) VALUES
('Carlos', 'García', 'carlos.garcia@universidad.edu', 'Programación', '2020-01-15'),
('María', 'López', 'maria.lopez@universidad.edu', 'Base de Datos', '2019-03-20'),
('Juan', 'Martínez', 'juan.martinez@universidad.edu', 'Algoritmos', '2021-02-10'),
('Ana', 'Rodríguez', 'ana.rodriguez@universidad.edu', 'Matemática', '2018-09-01'),
('Pedro', 'Fernández', 'pedro.fernandez@universidad.edu', 'Redes', '2020-06-15'),
('Laura', 'Sánchez', 'laura.sanchez@universidad.edu', 'Seguridad', '2021-08-20'),
('Roberto', 'González', 'roberto.gonzalez@universidad.edu', 'Inteligencia Artificial', '2022-01-10'),
('Sofía', 'Pérez', 'sofia.perez@universidad.edu', 'Desarrollo Web', '2019-11-05'),
('Diego', 'Torres', 'diego.torres@universidad.edu', 'Ingeniería de Software', '2020-04-12'),
('Carmen', 'Ruiz', 'carmen.ruiz@universidad.edu', 'Idiomas', '2018-02-28');

-- ============================================
-- AGREGAR COLUMNA DOCENTE_ID A MATERIA
-- ============================================

-- Agregar columna docente_id a la tabla materia
ALTER TABLE `materia`
ADD COLUMN `docente_id` INT(11) DEFAULT NULL AFTER `codigo`;

-- Agregar clave foránea
ALTER TABLE `materia`
ADD CONSTRAINT `fk_materia_docente`
FOREIGN KEY (`docente_id`) 
REFERENCES `docentes`(`iddocente`)
ON DELETE SET NULL;

-- ============================================
-- ASIGNAR DOCENTES A MATERIAS
-- ============================================

-- Asignar docentes a materias existentes según su especialidad
-- Docente 1 (Carlos García) - Programación
UPDATE `materia` SET `docente_id` = 1 WHERE `codigo` LIKE 'PROG%';

-- Docente 2 (María López) - Base de Datos
UPDATE `materia` SET `docente_id` = 2 WHERE `codigo` LIKE 'BD%' OR `codigo` LIKE 'DB%';

-- Docente 3 (Juan Martínez) - Algoritmos y Estructuras
UPDATE `materia` SET `docente_id` = 3 WHERE `codigo` LIKE 'ALG%' OR `codigo` LIKE 'ED%';

-- Docente 4 (Ana Rodríguez) - Matemática
UPDATE `materia` SET `docente_id` = 4 WHERE `codigo` LIKE 'MAT%' OR `nombre` LIKE '%Matemática%';

-- Docente 5 (Pedro Fernández) - Redes y Sistemas
UPDATE `materia` SET `docente_id` = 5 WHERE `codigo` LIKE 'RED%' OR `codigo` LIKE 'SO%';

-- Docente 6 (Laura Sánchez) - Seguridad
UPDATE `materia` SET `docente_id` = 6 WHERE `codigo` LIKE 'SI%' OR `nombre` LIKE '%Seguridad%';

-- Docente 7 (Roberto González) - Inteligencia Artificial
UPDATE `materia` SET `docente_id` = 7 WHERE `codigo` LIKE 'IA%' OR `nombre` LIKE '%Inteligencia%';

-- Docente 8 (Sofía Pérez) - Desarrollo Web
UPDATE `materia` SET `docente_id` = 8 WHERE `codigo` LIKE 'PW%' OR `codigo` LIKE 'WEB%';

-- Docente 9 (Diego Torres) - Ingeniería de Software
UPDATE `materia` SET `docente_id` = 9 WHERE `codigo` LIKE 'IS%' OR `nombre` LIKE '%Ingeniería%';

-- Docente 10 (Carmen Ruiz) - Idiomas y otros
UPDATE `materia` SET `docente_id` = 10 WHERE `codigo` LIKE 'ING%' OR `codigo` LIKE 'COM%';

-- Asignar docentes restantes a materias sin docente (distribución)
UPDATE `materia` 
SET `docente_id` = 1 
WHERE `docente_id` IS NULL AND `idmateria` % 3 = 0;

UPDATE `materia` 
SET `docente_id` = 2 
WHERE `docente_id` IS NULL AND `idmateria` % 3 = 1;

UPDATE `materia` 
SET `docente_id` = 3 
WHERE `docente_id` IS NULL AND `idmateria` % 3 = 2;

-- ============================================
-- VERIFICAR RESULTADOS
-- ============================================

-- Ver docentes creados
SELECT * FROM docentes ORDER BY apellido;

-- Ver materias con sus docentes
SELECT 
    m.nombre AS materia,
    m.codigo,
    CONCAT(d.nombre, ' ', d.apellido) AS docente,
    d.especialidad
FROM materia m
LEFT JOIN docentes d ON m.docente_id = d.iddocente
ORDER BY m.nombre;

-- Contar materias por docente
SELECT 
    CONCAT(d.nombre, ' ', d.apellido) AS docente,
    COUNT(m.idmateria) AS cantidad_materias
FROM docentes d
LEFT JOIN materia m ON d.iddocente = m.docente_id
GROUP BY d.iddocente, d.nombre, d.apellido
ORDER BY cantidad_materias DESC;

-- ============================================
-- RESTAURAR CONFIGURACIÓN: Habilitar Safe Updates
-- ============================================
-- Restauramos Safe Updates para mantener la seguridad en futuras operaciones

SET SQL_SAFE_UPDATES = 1;
