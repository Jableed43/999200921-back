# 📝 Tarea: Ejercicios Prácticos - Comisión 921

## Base de Datos: `universidad2`

**Tablas disponibles:**
- `estudiante` (idestudiante, nombre, apellido, email, fechaNacimiento, createdAt)
- `materia` (idmateria, nombre, codigo)
- `inscripciones` (idinscripcion, idestudiante, idmateria, fecha_inscripcion, nota)

---

## 📋 Instrucciones

1. **Ejecuta primero los scripts en orden:**
   - `paso1-crear-db-tablas-datos.sql`
   - `paso2-crear-inscripciones.sql`
   - `paso3-insertar-inscripciones.sql`

2. **Resuelve cada ejercicio** escribiendo la consulta SQL correspondiente.

3. **Copia y pega tus consultas** en MySQL Workbench para verificar los resultados.

4. **Entrega:** Crea un archivo `.sql` con todas tus consultas comentadas, o un documento con las consultas y capturas de pantalla de los resultados.

---

## 🎯 Ejercicios

### Ejercicio 1: Consultas Básicas (SELECT)

#### 1.1 Listar todos los estudiantes
Escribe una consulta que muestre todos los estudiantes con sus nombres, apellidos y emails.

**Resultado esperado:** Debe mostrar 30 estudiantes.

#### 1.2 Listar todas las materias
Escribe una consulta que muestre todas las materias con su nombre y código.

**Resultado esperado:** Debe mostrar 30 materias.

#### 1.3 Estudiantes ordenados por apellido
Escribe una consulta que muestre todos los estudiantes ordenados por apellido de forma ascendente.

#### 1.4 Estudiantes con edad calculada
Escribe una consulta que muestre nombre, apellido y la edad calculada a partir de `fechaNacimiento` (usa `YEAR(CURDATE()) - YEAR(fechaNacimiento)`).

---

### Ejercicio 2: Filtros y Condiciones (WHERE)

#### 2.1 Estudiantes nacidos después del año 2000
Escribe una consulta que muestre los estudiantes nacidos después del año 2000.

select * from estudiante
where YEAR(fechaNacimiento) > 2000

#### 2.2 Materias con código que empieza con "PROG"
Escribe una consulta que muestre las materias cuyo código empiece con "PROG" (usa `LIKE`).

#### 2.3 Estudiantes con email de Gmail
Escribe una consulta que muestre los estudiantes cuyo email contenga "@gmail.com".

#### 2.4 Inscripciones con nota mayor a 8
Escribe una consulta que muestre las inscripciones con nota mayor a 8, incluyendo el nombre del estudiante y la materia.

---

### Ejercicio 3: INNER JOIN

#### 3.1 Estudiantes con sus materias inscriptas
Escribe una consulta usando `INNER JOIN` que muestre:
- Nombre y apellido del estudiante
- Nombre de la materia
- Fecha de inscripción
- Nota

**Resultado esperado:** Solo estudiantes que tienen inscripciones.

#### 3.2 Materias con estudiantes inscriptos
Escribe una consulta usando `INNER JOIN` que muestre:
- Nombre de la materia
- Código de la materia
- Nombre y apellido del estudiante
- Nota

**Resultado esperado:** Solo materias que tienen estudiantes inscriptos.

select materia.nombre AS materia, materia.codigo, estudiante.nombre, estudiante.apellido, inscripciones.nota
from inscripciones
inner join estudiante on inscripciones.idestudiante = estudiante.idestudiante
inner join materia on inscripciones.idmateria = materia.idmateria

#### 3.3 Estudiantes con promedio de notas
Escribe una consulta que calcule el promedio de notas de cada estudiante que tiene al menos una nota. Muestra:
- Nombre y apellido del estudiante
- Cantidad de materias con nota
- Promedio de notas

**Pista:** Usa `INNER JOIN`, `GROUP BY`, `AVG()`, `ROUND(VALOR, 2)` y `COUNT()`.

select e.nombre, e.apellido,
	COUNT(i.nota) AS cantidad_materias,
	ROUND(AVG(i.nota),2) AS promedio_nota
    from estudiante e
	inner join inscripciones i on e.idestudiante = i.idestudiante
    -- la validacion se hace en el where
    where i.nota IS NOT NULL
    -- El group by es necesario cuando en la tabla resultante queremos que se identifique mas de una tabla
    -- x ej si mostraramos materia, deberiamos agrupar tambien por el PK de materia
	GROUP BY e.idestudiante

---

### Ejercicio 4: LEFT JOIN

#### 4.1 Todos los estudiantes, incluso sin inscripciones
Escribe una consulta usando `LEFT JOIN` que muestre:
- Nombre y apellido del estudiante
- Nombre de la materia (será NULL si no tiene inscripciones)
- Nota (será NULL si no tiene inscripciones)

**Resultado esperado:** Debe mostrar 30 estudiantes, algunos con NULL en materia y nota.

select estudiante.nombre, estudiante.apellido, materia.nombre as materia, inscripciones.nota
from estudiante
left join inscripciones on estudiante.idestudiante = inscripciones.idestudiante
left join materia on inscripciones.idmateria = materia.idmateria

#### 4.2 Estudiantes sin inscripciones
Escribe una consulta usando `LEFT JOIN` y `WHERE IS NULL` que muestre los estudiantes que NO tienen ninguna inscripción.

**Resultado esperado:** Debe mostrar algunos estudiantes (los que no tienen inscripciones).

#### 4.3 Cantidad de materias por estudiante
Escribe una consulta que muestre:
- Nombre y apellido del estudiante
- Cantidad de materias en las que está inscrito (0 si no tiene inscripciones)

**Pista:** Usa `LEFT JOIN` y `COUNT()` con `GROUP BY`.

---

### Ejercicio 5: RIGHT JOIN

#### 5.1 Todas las materias, incluso sin estudiantes
Escribe una consulta usando `RIGHT JOIN` que muestre:
- Nombre de la materia
- Código de la materia
- Nombre y apellido del estudiante (será NULL si no tiene estudiantes)
- Nota (será NULL si no tiene estudiantes)

**Resultado esperado:** Debe mostrar 30 materias, algunas con NULL en estudiante y nota.

#### 5.2 Materias sin estudiantes inscriptos
Escribe una consulta usando `RIGHT JOIN` y `WHERE IS NULL` que muestre las materias que NO tienen ningún estudiante inscrito.

**Resultado esperado:** Debe mostrar algunas materias (las que no tienen inscripciones).

** left **
select materia.nombre, materia.codigo, materia.idmateria from materia
left join inscripciones on materia.idmateria = inscripciones.idmateria
where inscripciones.idinscripcion is null
** right **
select materia.nombre, materia.codigo, materia.idmateria from inscripciones
right join materia on inscripciones.idmateria = materia.idmateria
where inscripciones.idinscripcion is null

#### 5.3 Cantidad de estudiantes por materia
Escribe una consulta que muestre:
- Nombre de la materia
- Código de la materia
- Cantidad de estudiantes inscriptos (0 si no tiene estudiantes)

**Pista:** Usa `RIGHT JOIN` y `COUNT()` con `GROUP BY`.

---

### Ejercicio 6: Funciones de Agregación

#### 6.1 Estadísticas generales de inscripciones
Escribe una consulta que muestre:
- Total de inscripciones
- Cantidad de inscripciones con nota
- Promedio de todas las notas
- Nota máxima
- Nota mínima

#### 6.2 Top 5 materias más populares
Escribe una consulta que muestre las 5 materias con más estudiantes inscriptos:
- Nombre de la materia
- Código
- Cantidad de estudiantes inscriptos

**Pista:** Usa `GROUP BY`, `COUNT()` y `ORDER BY` con `LIMIT`.

select materia.nombre, materia.codigo,
	COUNT(inscripciones.idestudiante) AS cantidad_estudiantes
    from materia
    left join inscripciones on materia.idmateria = inscripciones.idmateria
    group by materia.idmateria, materia.nombre, materia.codigo
    order by cantidad_estudiantes DESC

**Investigar como se puede respestar el rank del top 3 materias**

#### 6.3 Estudiantes con mejor promedio
Escribe una consulta que muestre los 3 estudiantes con mejor promedio de notas:
- Nombre y apellido
- Cantidad de materias con nota
- Promedio de notas

**Pista:** Usa `INNER JOIN`, `GROUP BY`, `AVG()`, `ORDER BY` y `LIMIT`.

---

### Ejercicio 7: GROUP BY y HAVING

#### 7.1 Materias con más de 3 estudiantes
Escribe una consulta que muestre las materias que tienen más de 3 estudiantes inscriptos:
- Nombre de la materia
- Cantidad de estudiantes

**Pista:** Usa `GROUP BY` y `HAVING COUNT() > 3`.

#### 7.2 Estudiantes inscriptos en más de 2 materias
Escribe una consulta que muestre los estudiantes que están inscriptos en más de 2 materias:
- Nombre y apellido
- Cantidad de materias

#### 7.3 Materias con promedio mayor a 8
Escribe una consulta que muestre las materias cuyo promedio de notas sea mayor a 8:
- Nombre de la materia
- Promedio de notas
- Cantidad de estudiantes con nota

---

### Ejercicio 8: Verificación de Integridad Referencial

#### 8.1 Verificar inscripciones válidas
Escribe una consulta que verifique que todas las inscripciones tienen estudiantes y materias válidos. Debe mostrar:
- ID de inscripción
- ID de estudiante
- ID de materia
- Estado (OK o ERROR)

**Pista:** Usa `LEFT JOIN` y `CASE` para verificar si existen.

**Resultado esperado:** Si la integridad está bien, no debe mostrar errores.

#### 8.2 Contar inscripciones por estudiante
Escribe una consulta que muestre cuántas inscripciones tiene cada estudiante, incluso los que no tienen ninguna (debe mostrar 0):
- Nombre y apellido
- Cantidad de inscripciones

---

### Ejercicio 9: ON DELETE CASCADE y RESTRICT

#### 9.1 Probar ON DELETE CASCADE
**⚠️ IMPORTANTE:** Haz esto en una copia de la base de datos o después de hacer un respaldo.

1. Antes de eliminar, cuenta cuántas inscripciones tiene el estudiante con `idestudiante = 1`:
```sql
SELECT COUNT(*) as total_inscripciones 
FROM inscripciones 
WHERE idestudiante = 1;
```

2. Elimina el estudiante con `idestudiante = 1`:
```sql
DELETE FROM estudiante WHERE idestudiante = 1;
```

3. Verifica que las inscripciones se eliminaron automáticamente:
```sql
SELECT COUNT(*) as total_inscripciones 
FROM inscripciones 
WHERE idestudiante = 1;
```

**Pregunta:** ¿Qué pasó con las inscripciones? ¿Por qué?

#### 9.2 Probar ON DELETE RESTRICT
Intenta eliminar una materia que tiene inscripciones:
```sql
-- Primero, verifica qué materias tienen inscripciones
SELECT m.idmateria, m.nombre, COUNT(i.idinscripcion) as total_inscripciones
FROM materia m
LEFT JOIN inscripciones i ON m.idmateria = i.idmateria
GROUP BY m.idmateria, m.nombre
HAVING COUNT(i.idinscripcion) > 0
LIMIT 1;

-- Luego intenta eliminar esa materia (reemplaza X con el idmateria)
DELETE FROM materia WHERE idmateria = X;
```

**Pregunta:** ¿Qué error obtuviste? ¿Por qué no se puede eliminar?

---

### Ejercicio 10: Consultas Avanzadas

#### 10.1 Estudiantes con todas sus materias en una sola fila
Escribe una consulta que muestre cada estudiante con todas sus materias concatenadas en una sola columna (usa `GROUP_CONCAT`):
- Nombre y apellido
- Lista de materias (separadas por comas)

**Pista:** Usa `GROUP_CONCAT(m.nombre SEPARATOR ', ')`.

#### 10.2 Materias con mejor y peor nota
Escribe una consulta que muestre para cada materia:
- Nombre de la materia
- Mejor nota
- Peor nota
- Diferencia entre mejor y peor nota

#### 10.3 Estudiantes que están en todas las materias de programación
Escribe una consulta que muestre los estudiantes que están inscriptos en TODAS las materias cuyo código empiece con "PROG":
- Nombre y apellido
- Cantidad de materias PROG en las que está inscrito

**Pista:** Primero cuenta cuántas materias PROG hay, luego busca estudiantes que tengan esa cantidad de inscripciones.

---

## ✅ Criterios de Evaluación

- **Correctitud:** Las consultas deben ejecutarse sin errores y devolver los resultados esperados.
- **Uso correcto de JOINs:** Debes usar el tipo de JOIN apropiado para cada caso.
- **Funciones de agregación:** Debes usar correctamente COUNT, AVG, MAX, MIN, SUM.
- **GROUP BY y HAVING:** Debes agrupar y filtrar correctamente.
- **Comentarios:** Incluye comentarios explicando qué hace cada consulta.

---

## 📚 Recursos

- Material de clase: `Actividades-Clase-2.md`
- Scripts de base de datos: `paso1-crear-db-tablas-datos.sql`, `paso2-crear-inscripciones.sql`, `paso3-insertar-inscripciones.sql`
- Documentación MySQL: https://dev.mysql.com/doc/

---

## 💡 Tips

1. **Empieza simple:** Primero haz consultas básicas y luego agrega complejidad.
2. **Prueba cada consulta:** Ejecuta cada consulta en MySQL Workbench antes de pasar a la siguiente.
3. **Usa alias:** Usa alias de tablas (`e`, `m`, `i`) para hacer las consultas más legibles.
4. **Verifica resultados:** Compara tus resultados con los esperados.
5. **Lee los errores:** Si una consulta falla, lee el mensaje de error cuidadosamente.

---

**¡Buena suerte! 🚀**

