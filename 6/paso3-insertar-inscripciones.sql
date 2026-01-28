-- ============================================
-- COMISIÓN 921 - PASO 3: Insertar Inscripciones
-- ============================================
-- Objetivo: Insertar inscripciones variadas para practicar JOINs
--          IMPORTANTE: Algunos estudiantes NO tendrán inscripciones (para LEFT JOIN)
--          IMPORTANTE: Algunas materias NO tendrán estudiantes (para RIGHT JOIN)
--          Esto permitirá ver claramente las diferencias entre INNER, LEFT y RIGHT JOIN
--
-- ESTRUCTURA DE DATOS:
-- - Estudiantes 1-15: Tienen inscripciones
-- - Estudiantes 16-20: NO tienen inscripciones (aparecerán con NULL en LEFT JOIN)
-- - Estudiantes 21-30: Algunos tienen, algunos no
-- - Materias 1-20: Tienen estudiantes
-- - Materias 21-25: NO tienen estudiantes (aparecerán con NULL en RIGHT JOIN)
-- - Materias 26-30: Algunas tienen, algunas no
--
-- LISTO PARA COPIAR Y PEGAR EN MYSQL WORKBENCH

USE `universidad2`;

-- Insertar inscripciones (variadas para practicar diferentes consultas)
INSERT INTO `inscripciones` (`idestudiante`, `idmateria`, `fecha_inscripcion`, `nota`) VALUES
-- ============================================
-- ESTUDIANTES 1-15: Tienen inscripciones
-- ============================================
-- Estudiante 1 (Javier) - 3 materias
(1, 1, '2025-01-10', 8.5),   -- Programación I
(1, 2, '2025-01-10', 7.0),   -- Base de Datos
(1, 5, '2025-01-15', 9.0),   -- Programación II

-- Estudiante 2 (Matias) - 4 materias
(2, 1, '2025-01-11', 9.0),   -- Programación I
(2, 3, '2025-01-11', 8.0),   -- Matemática
(2, 6, '2025-01-12', 7.5),   -- Estructuras de Datos
(2, 11, '2025-01-20', NULL), -- Ingeniería de Software (sin nota)

-- Estudiante 3 (Theo) - 2 materias
(3, 2, '2025-01-12', NULL),  -- Base de Datos (sin nota)
(3, 4, '2025-01-12', 6.5),   -- Inglés

-- Estudiante 4 (Angel) - 3 materias
(4, 1, '2025-01-13', 8.0),   -- Programación I
(4, 7, '2025-01-13', 7.5),   -- Algoritmos
(4, 12, '2025-01-14', 9.5),  -- Bases de Datos Avanzadas

-- Estudiante 5 (Sofia) - 5 materias
(5, 1, '2025-01-14', 9.5),   -- Programación I
(5, 2, '2025-01-14', 8.5),   -- Base de Datos
(5, 5, '2025-01-15', 9.0),   -- Programación II
(5, 13, '2025-01-16', 8.0),  -- Programación Web
(5, 14, '2025-01-17', NULL), -- Desarrollo Mobile

-- Estudiante 6 (Lucas) - 2 materias
(6, 3, '2025-01-15', 7.0),   -- Matemática
(6, 17, '2025-01-15', 6.0),  -- Cálculo I

-- Estudiante 7 (Valentina) - 4 materias
(7, 1, '2025-01-16', 8.5),   -- Programación I
(7, 6, '2025-01-16', 7.5),   -- Estructuras de Datos
(7, 7, '2025-01-17', 8.0),   -- Algoritmos
(7, 15, '2025-01-18', 9.0),  -- Inteligencia Artificial

-- Estudiante 8 (Mateo) - 3 materias
(8, 2, '2025-01-17', 7.5),   -- Base de Datos
(8, 8, '2025-01-17', 6.5),   -- Sistemas Operativos
(8, 9, '2025-01-18', NULL),  -- Redes de Computadoras

-- Estudiante 9 (Isabella) - 4 materias
(9, 1, '2025-01-18', 9.0),   -- Programación I
(9, 5, '2025-01-18', 8.5),   -- Programación II
(9, 13, '2025-01-19', 9.5),  -- Programación Web
(9, 14, '2025-01-20', 8.0),  -- Desarrollo Mobile

-- Estudiante 10 (Santiago) - 2 materias
(10, 3, '2025-01-19', 8.0),  -- Matemática
(10, 18, '2025-01-19', 7.0), -- Cálculo II

-- Estudiante 11 (Camila) - 3 materias
(11, 1, '2025-01-20', 7.5),  -- Programación I
(11, 2, '2025-01-20', 8.0),  -- Base de Datos
(11, 11, '2025-01-21', 7.0), -- Ingeniería de Software

-- Estudiante 12 (Nicolas) - 4 materias
(12, 6, '2025-01-21', 8.5),  -- Estructuras de Datos
(12, 7, '2025-01-21', 9.0),  -- Algoritmos
(12, 10, '2025-01-22', 7.5), -- Arquitectura de Computadoras
(12, 16, '2025-01-22', 8.0), -- Seguridad Informática

-- Estudiante 13 (Martina) - 2 materias
(13, 4, '2025-01-22', 9.0),  -- Inglés
(13, 23, '2025-01-22', 8.5), -- Inglés Técnico

-- Estudiante 14 (Sebastian) - 5 materias
(14, 1, '2025-01-23', 8.0),  -- Programación I
(14, 5, '2025-01-23', 7.5),  -- Programación II
(14, 13, '2025-01-24', 8.5), -- Programación Web
(14, 15, '2025-01-24', 9.0), -- Inteligencia Artificial
(14, 26, '2025-01-25', NULL),-- Proyecto Integrador I

-- Estudiante 15 (Lucia) - 3 materias
(15, 2, '2025-01-24', 9.5),  -- Base de Datos
(15, 12, '2025-01-24', 8.5), -- Bases de Datos Avanzadas
(15, 16, '2025-01-25', 7.5), -- Seguridad Informática

-- ============================================
-- ESTUDIANTES 16-20: NO tienen inscripciones
-- (Aparecerán con NULL en LEFT JOIN desde estudiantes)
-- ============================================
-- Estudiante 16 (Diego) - SIN INSCRIPCIONES
-- Estudiante 17 (Emma) - SIN INSCRIPCIONES
-- Estudiante 18 (Benjamin) - SIN INSCRIPCIONES
-- Estudiante 19 (Olivia) - SIN INSCRIPCIONES
-- Estudiante 20 (Maximo) - SIN INSCRIPCIONES

-- ============================================
-- ESTUDIANTES 21-30: Algunos tienen inscripciones
-- ============================================
-- Estudiante 21 (Amelia) - 1 materia
(21, 1, '2025-01-28', 8.0),  -- Programación I

-- Estudiante 22 (Tomas) - 1 materia
(22, 2, '2025-01-28', 7.0),  -- Base de Datos

-- Estudiante 23 (Mia) - 1 materia
(23, 1, '2025-01-29', 9.5),  -- Programación I

-- Estudiante 24 (Agustin) - 1 materia
(24, 4, '2025-01-29', 8.0),  -- Inglés

-- Estudiante 25 (Catalina) - SIN INSCRIPCIONES

-- Estudiante 26 (Joaquin) - 1 materia
(26, 2, '2025-01-30', 8.0),  -- Base de Datos

-- Estudiante 27 (Victoria) - 1 materia
(27, 1, '2025-02-01', 8.5),  -- Programación I

-- Estudiante 28 (Ignacio) - SIN INSCRIPCIONES

-- Estudiante 29 (Antonella) - 1 materia
(29, 1, '2025-02-02', 9.0)