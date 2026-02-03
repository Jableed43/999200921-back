# Actividades Prácticas - Clase 3: Consultas Avanzadas

**Base de datos**: `universidad2`  
**Duración total**: 90-120 minutos  
**Objetivo**: Aplicar HAVING, subconsultas, CASE WHEN, UNION y funciones de fecha/texto en consultas con impacto de negocio.

> ⚠️ **IMPORTANTE**: Esta clase usa la base de datos `universidad2` con las siguientes tablas:
> - `estudiante` (singular) - columnas: `idestudiante`, `nombre`, `apellido`, `email`, `fechaNacimiento`
> - `materia` (singular) - columnas: `idmateria`, `nombre`, `codigo`, `docente_id`
> - `inscripciones` (plural) - columnas: `idinscripcion`, `idestudiante`, `idmateria`, `fecha_inscripcion`, `nota`
> - `docentes` (plural) - columnas: `iddocente`, `nombre`, `apellido`, `email`, `especialidad`, `fecha_ingreso`

---

## 🎯 Actividad 1: Reportes de Rendimiento Académico (30 min)

### Objetivo
Generar reportes útiles para la gestión académica usando HAVING y funciones de agregación.

### Ejercicio 1.1: Estudiantes Destacados
**Problema de negocio**: Identificar estudiantes con excelente rendimiento para reconocimientos o becas.

**Consulta**: Encontrar estudiantes que tienen:
- Promedio mayor a 8.5
- Al menos 3 materias con nota

```sql
USE universidad2;

-- Tu consulta aquí
    select estudiante.nombre, estudiante.apellido, count(inscripciones.idmateria) as cantidad_materias, round(avg(inscripciones.nota), 2) as promedio_notas
    from estudiante
    inner join inscripciones on estudiante.idestudiante = inscripciones.idestudiante
    where inscripciones.nota is not null
    group by estudiante.idestudiante
    having promedio_notas > 8.5 and cantidad_materias >= 3
    order by promedio_notas desc
-- Pista: Tablas: estudiante, materia, inscripciones, docentes
-- Columnas: idestudiante, idmateria, iddocente, idinscripcion
```

**Resultado esperado**: Lista de estudiantes con nombre, apellido, cantidad de materias y promedio, ordenados por promedio descendente.

---

### Ejercicio 1.2: Materias con Bajo Rendimiento
**Problema de negocio**: Identificar materias que necesitan atención porque tienen muchos estudiantes con notas bajas.

**Consulta**: Encontrar materias donde:
- El promedio de notas sea menoro igual a 6

```sql
-- Tu consulta aquí
select m.nombre, m.codigo, count(i.idestudiante) as cantidad_estudiantes, round(avg(i.nota), 2) as promedio_notas
from materia m
inner join inscripciones i on m.idmateria = i.idmateria
where i.nota is not null
group by m.idmateria, m.nombre, m.codigo
having promedio_notas <= 6
order by promedio_notas ASC
```

**Resultado esperado**: Lista de materias con nombre, código, cantidad de estudiantes y promedio de notas.

---

### Ejercicio 1.3: Materias Populares y Exitosas
**Problema de negocio**: Identificar las materias más demandadas y con buen rendimiento para planificar recursos.

**Consulta**: Encontrar materias que cumplan AMBAS condiciones:
- Tengan más de 8 estudiantes inscritos
- El promedio de notas sea mayor a 7

```sql
-- Tu consulta aquí
```

**Resultado esperado**: Lista de materias ordenadas por cantidad de estudiantes descendente.

---

### Ejercicio 1.4: Docentes con Muchas Materias
**Problema de negocio**: Identificar docentes con alta carga laboral para redistribuir materias.

**Consulta**: Encontrar docentes que tienen:
- Más de 3 materias asignadas
- Mostrar nombre, apellido, especialidad y cantidad de materias

```sql
-- Tu consulta aquí
select d.nombre, d.apellido, d.especialidad, count(m.idmateria) as cantidad_materias
from docentes d 
inner join materia m on d.iddocente = m.docente_id
group by d.especialidad, d.iddocente, d.nombre
having cantidad_materias > 3
order by cantidad_materias DESC

```

**Resultado esperado**: Lista de docentes ordenados por cantidad de materias descendente.

---

## 🎯 Actividad 2: Análisis Comparativo con Subconsultas (25 min)

### Objetivo
Usar subconsultas para hacer comparaciones y análisis comparativos.

### Ejercicio 2.1: Estudiantes por Encima del Promedio
**Problema de negocio**: Identificar estudiantes que están por encima del promedio general para reconocer su desempeño.

**Consulta**: Listar estudiantes cuyo promedio personal sea mayor al promedio general de todos los estudiantes.

```sql
-- Tu consulta aquí
-- Pista: Necesitarás una subconsulta para calcular el promedio general
select e.nombre, e.apellido, round(avg(i.nota), 2) as promedio_personal
from estudiante e
inner join inscripciones i on e.idestudiante = i.idestudiante
where i.nota is not null
group by e.idestudiante, e.nombre, e.apellido
having promedio_personal > (
	select AVG(inscripciones.nota)
    from inscripciones
    where nota is not null
)
order by promedio_personal DESC
```

**Resultado esperado**: Estudiantes con nombre, apellido, su promedio personal y el promedio general (para comparar).

---

### Ejercicio 2.2: Materias con Más Estudiantes que el Promedio
**Problema de negocio**: Identificar materias que tienen más demanda que el promedio para asignar más recursos.

**Consulta**: Encontrar materias que tienen más estudiantes inscritos que el promedio de estudiantes por materia.

```sql
-- Tu consulta aquí
-- Pista: Calcula el promedio de estudiantes por materia en una subconsulta
```

**Resultado esperado**: Materias con nombre, código y cantidad de estudiantes (mostrando también el promedio para comparar).

---

### Ejercicio 2.3: Estudiantes en Materias de Programación
**Problema de negocio**: Identificar qué estudiantes están inscritos en materias de programación para ofrecerles recursos adicionales.

**Consulta**: Listar estudiantes que están inscritos en al menos una materia cuyo código empiece con "PROG".

```sql
-- Tu consulta aquí
-- Pista: Usa IN con una subconsulta que encuentre los IDs de materias PROG
-- con group by
select e.idestudiante, e.nombre, e.apellido, e.email
from estudiante e
inner join inscripciones i on e.idestudiante = i.idestudiante
where i.idmateria IN (
	select idmateria from materia
	where codigo LIKE "PROG%"
)
group by e.idestudiante

-- Con distinct, cuando no agrupamos con identificador unico
select distinct e.nombre, e.apellido, e.email
from estudiante e
inner join inscripciones i on e.idestudiante = i.idestudiante
where i.idmateria IN (
	select idmateria from materia
	where codigo LIKE "PROG%"
)
```

**Resultado esperado**: Lista de estudiantes únicos con nombre, apellido y email.

---

### Ejercicio 2.4: Docentes con Materias de Alto Rendimiento
**Problema de negocio**: Identificar docentes que dictan materias con buen rendimiento para reconocer su trabajo.

**Consulta**: Encontrar docentes que dictan al menos una materia con promedio mayor a 8.

```sql
-- Tu consulta aquí
-- Pista: Usa EXISTS o IN con una subconsulta
```

**Resultado esperado**: Lista de docentes con nombre, apellido y especialidad.

---

## 🎯 Actividad 3: Clasificación y Categorización con CASE (20 min)

### Objetivo
Usar CASE WHEN para clasificar y categorizar datos de manera útil para el negocio.

### Ejercicio 3.1: Clasificación de Rendimiento Estudiantil
**Problema de negocio**: Clasificar estudiantes según su rendimiento para personalizar el apoyo académico.

**Consulta**: Clasificar estudiantes según su promedio:
- "Excelente" si promedio >= 9
- "Muy Bueno" si promedio >= 8 y < 9
- "Bueno" si promedio >= 7 y < 8
- "Regular" si promedio >= 6 y < 7
- "Necesita Apoyo" si promedio < 6

```sql
-- Tu consulta aquí
select e.nombre, e.apellido, round(avg(i.nota), 2) as promedio_notas,
	CASE
		when avg(i.nota) >= 9 then "Excelente"
		when avg(i.nota) >= 8 then "Muy Bueno"
		when avg(i.nota) >= 7 then "Bueno"
		when avg(i.nota) >= 6 then "Regular"
		else "Necesita apoyo"
    end as clasificacion
from estudiante e
inner join inscripciones i on e.idestudiante = i.idestudiante
where i.nota is not null
group by e.nombre, e.apellido
order by promedio_notas DESC
```

**Resultado esperado**: Estudiantes con nombre, apellido, promedio y clasificación, ordenados por promedio descendente.

---

### Ejercicio 3.2: Estado de Inscripciones
**Problema de negocio**: Ver el estado de cada inscripción para seguimiento académico.

**Consulta**: Mostrar todas las inscripciones con su estado:
- "Aprobado" si nota >= 7
- "Desaprobado" si nota < 7 y nota IS NOT NULL
- "En Curso" si nota IS NULL

```sql
-- Tu consulta aquí
```

**Resultado esperado**: Lista de inscripciones con estudiante, materia, nota y estado.

---

### Ejercicio 3.3: Popularidad de Materias
**Problema de negocio**: Clasificar materias según su demanda para planificación de horarios y recursos.

**Consulta**: Clasificar materias según cantidad de estudiantes:
- "Muy Popular" si tiene más de 10 estudiantes
- "Popular" si tiene entre 5 y 10 estudiantes
- "Normal" si tiene entre 1 y 4 estudiantes
- "Sin Inscripciones" si tiene 0 estudiantes

```sql
-- Tu consulta aquí
```

**Resultado esperado**: Materias con nombre, código, cantidad de estudiantes y categoría de popularidad.

---

### Ejercicio 3.4: Carga Laboral de Docentes
**Problema de negocio**: Clasificar docentes según su carga de trabajo para planificación.

**Consulta**: Clasificar docentes según cantidad de materias:
- "Alta Carga" si tiene más de 5 materias
- "Carga Normal" si tiene entre 2 y 5 materias
- "Baja Carga" si tiene 1 materia
- "Sin Materias" si tiene 0 materias

```sql
-- Tu consulta aquí
```

**Resultado esperado**: Docentes con nombre, apellido, cantidad de materias y clasificación de carga.

---

## 🎯 Actividad 4: Combinación de Datos con UNION (15 min)

### Objetivo
Usar UNION para combinar diferentes tipos de datos en reportes unificados.

### Ejercicio 4.1: Reporte Unificado de Personas
**Problema de negocio**: Tener una lista unificada de todas las personas (estudiantes y docentes) para comunicación masiva.

**Consulta**: Crear una lista única que combine estudiantes y docentes, mostrando:
- Nombre completo (nombre + apellido)
- Email
- Tipo ("Estudiante" o "Docente")

```sql
-- Tu consulta aquí
select estudiante.nombre, estudiante.apellido, estudiante.email, "Estudiante" as tipo
from estudiante
union
select docentes.nombre, docentes.apellido, docentes.email, "Docente" as tipo
from docentes
```

**Resultado esperado**: Lista unificada ordenada alfabéticamente por apellido.

---

### Ejercicio 4.2: Materias por Diferentes Criterios
**Problema de negocio**: Identificar materias que destacan por cantidad de estudiantes O por buen rendimiento.

**Consulta**: Combinar dos listas de materias:
1. Materias con más de 8 estudiantes (criterio: cantidad)
2. Materias con promedio mayor a 8 (criterio: rendimiento)

Mostrar nombre, código y el criterio por el cual aparece.

```sql
-- Tu consulta aquí
```

**Resultado esperado**: Lista combinada de materias que cumplen cualquiera de los dos criterios.

---

## 🎯 Actividad 5: Funciones de Fecha y Texto (20 min)

### Objetivo
Usar funciones de fecha y texto para generar reportes más legibles y útiles.

### Ejercicio 5.1: Edad de Estudiantes
**Problema de negocio**: Calcular la edad exacta de estudiantes para análisis demográfico y planificación.

**Consulta**: Mostrar estudiantes con:
- Nombre completo (concatenado)
- Fecha de nacimiento formateada (dd/mm/yyyy)
- Edad calculada en años

```sql
-- Tu consulta aquí
-- Pista: Usa CONCAT para nombre completo, DATE_FORMAT para fecha, y DATEDIFF para edad
```

**Resultado esperado**: Lista de estudiantes con información formateada y edad calculada.

---

### Ejercicio 5.2: Inscripciones Recientes
**Problema de negocio**: Identificar inscripciones del último mes para seguimiento de nuevos estudiantes.

**Consulta**: Mostrar inscripciones realizadas en los últimos 30 días con:
- Nombre completo del estudiante
- Nombre de la materia
- Fecha de inscripción formateada (dd/mm/yyyy)
- Días transcurridos desde la inscripción

```sql
-- Tu consulta aquí
```

**Resultado esperado**: Lista de inscripciones recientes ordenadas por fecha descendente.

---

### Ejercicio 5.3: Formateo de Emails
**Problema de negocio**: Extraer información útil de los emails para análisis de dominio.

**Consulta**: Mostrar estudiantes con:
- Nombre completo en mayúsculas
- Email completo
- Dominio del email (parte después de @)

```sql
-- Tu consulta aquí
-- Pista: Usa UPPER para nombre, SUBSTRING y POSITION para extraer dominio
```

**Resultado esperado**: Lista con nombres en mayúsculas y dominio extraído.

---

### Ejercicio 5.4: Antigüedad de Docentes
**Problema de negocio**: Calcular años de antigüedad de docentes para reconocimientos.

**Consulta**: Mostrar docentes con:
- Nombre completo
- Fecha de ingreso formateada
- Años de antigüedad calculados

```sql
-- Tu consulta aquí
```

**Resultado esperado**: Lista de docentes ordenados por antigüedad descendente.

---

## 🎯 Actividad 6: Consultas Integradas (20 min)

### Objetivo
Combinar múltiples conceptos en consultas más complejas pero útiles para el negocio.

### Ejercicio 6.1: Reporte Completo de Estudiantes
**Problema de negocio**: Generar un reporte completo de cada estudiante para evaluación académica.

**Consulta**: Crear un reporte que muestre:
- Nombre completo del estudiante
- Edad calculada
- Cantidad de materias inscritas
- Promedio de notas (si tiene)
- Clasificación según promedio (usando CASE)
- Estado general ("Activo" si tiene inscripciones, "Inactivo" si no)

```sql
-- Tu consulta aquí
-- Combina: CONCAT, DATEDIFF, COUNT, AVG, CASE, LEFT JOIN
```

**Resultado esperado**: Reporte completo ordenado por promedio descendente.

---

### Ejercicio 6.2: Dashboard de Materias
**Problema de negocio**: Crear un dashboard con estadísticas completas de cada materia para toma de decisiones.

**Consulta**: Generar estadísticas de cada materia:
- Nombre y código
- Docente asignado (si tiene)
- Cantidad total de estudiantes inscritos
- Cantidad de estudiantes con nota
- Promedio de notas
- Nota máxima y mínima
- Clasificación de popularidad (usando CASE)
- Diferencia entre nota máxima y mínima

```sql
-- Tu consulta aquí
-- Combina: COUNT, AVG, MAX, MIN, CASE, GROUP BY, LEFT JOIN con docentes
```

**Resultado esperado**: Dashboard completo ordenado por cantidad de estudiantes descendente.

---

### Ejercicio 6.3: Análisis Comparativo Avanzado
**Problema de negocio**: Comparar el rendimiento de cada estudiante con el promedio de su materia más difícil.

**Consulta**: Mostrar estudiantes con:
- Nombre completo
- Materia con su nota más baja
- Nota obtenida
- Promedio de esa materia (usando subconsulta)
- Diferencia entre su nota y el promedio
- Estado ("Por encima del promedio" o "Por debajo del promedio" usando CASE)

```sql
-- Tu consulta aquí
-- Combina: Subconsultas, CASE, JOINs, funciones de agregación
```

**Resultado esperado**: Análisis comparativo ordenado por diferencia descendente.

---

### Ejercicio 6.4: Reporte Completo de Docentes
**Problema de negocio**: Generar un reporte completo de cada docente con sus materias y estadísticas.

**Consulta**: Crear un reporte que muestre:
- Nombre completo del docente
- Especialidad
- Años de antigüedad
- Cantidad de materias asignadas
- Promedio general de notas de sus materias
- Clasificación de carga laboral (usando CASE)

```sql
-- Tu consulta aquí
```

**Resultado esperado**: Reporte completo de docentes ordenado por cantidad de materias descendente.

---

## 📋 Checklist de Verificación

Antes de considerar completados los ejercicios, verifica:

- [ ] Todas las consultas ejecutan sin errores
- [ ] Los resultados tienen sentido para el negocio
- [ ] Se usan alias descriptivos para las columnas
- [ ] Las consultas están ordenadas de manera lógica
- [ ] Se incluyen comentarios explicativos donde sea necesario
- [ ] Los nombres de columnas son claros y descriptivos

---

## 💡 Pistas y Ayudas

### Para HAVING:
- Recuerda que HAVING va después de GROUP BY
- Puedes usar alias de columnas en HAVING
- Puedes combinar múltiples condiciones con AND/OR

### Para Subconsultas:
- Las subconsultas escalares devuelven un solo valor
- Usa IN cuando necesites comparar con múltiples valores
- Las subconsultas correlacionadas hacen referencia a la consulta externa

### Para CASE WHEN:
- Siempre termina con END
- Puedes usar ELSE para valores por defecto
- CASE puede usarse en SELECT, ORDER BY, y GROUP BY

### Para UNION:
- Todas las consultas deben tener el mismo número de columnas
- Los tipos de datos deben ser compatibles
- UNION elimina duplicados, UNION ALL los mantiene

### Para Funciones de Fecha:
- CURDATE() devuelve la fecha actual
- DATEDIFF(fecha1, fecha2) calcula diferencia en días
- DATE_FORMAT() formatea fechas según el patrón que indiques

### Para Funciones de Texto:
- CONCAT() une textos
- SUBSTRING() extrae parte del texto
- UPPER() y LOWER() cambian mayúsculas/minúsculas

---

## 🎓 Soluciones Sugeridas

**Nota para el docente**: Las soluciones están disponibles en [SOLUCIONES-Actividades-Clase-3-Universidad2.md](./SOLUCIONES-Actividades-Clase-3-Universidad2.md) para revisión antes de la clase.

---

## 📚 Recursos Adicionales

- [MySQL-Guia-Maestra.md](../MySQL-Guia-Maestra.md)
- [Clase-3-Consultas-Avanzadas-Universidad2.md](./Clase-3-Consultas-Avanzadas-Universidad2.md)
- [SOLUCIONES-Actividades-Clase-3-Universidad2.md](./SOLUCIONES-Actividades-Clase-3-Universidad2.md)
- Scripts de base de datos: [bd-comisiones/921/](./bd-comisiones/921/)
- Documentación oficial MySQL: https://dev.mysql.com/doc/

---

**Tiempo estimado por actividad:**
- Actividad 1: 35 min (incluye docentes)
- Actividad 2: 30 min (incluye docentes)
- Actividad 3: 25 min (incluye docentes)
- Actividad 4: 15 min
- Actividad 5: 25 min (incluye docentes)
- Actividad 6: 25 min (incluye docentes)
- **Total: 155 minutos (2 horas 35 minutos)**

**Ajuste según el tiempo disponible**: Puedes seleccionar las actividades más relevantes o dividirlas en múltiples sesiones.

