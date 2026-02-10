# Ejercicios Prácticos - Clase 2: Operadores Lógicos y $match
## Consignas para Estudiantes

**Base de Datos**: `escuela`  
**Colecciones**: `estudiantes` y `materias`

> **Nota**: Este archivo contiene las consignas de los ejercicios. Las soluciones están disponibles en `Clase-2-Ejercicios-Practicos.md`.

---

## 📑 Índice de Navegación Rápida

### Preparación
- [📋 Preparación: Set de Datos](#-preparación-set-de-datos)

### Fases de Ejercicios
- [🎯 FASE 1: Operador $and (5 ejercicios)](#-fase-1-operador-and-nivel-intermedio)
- [🎯 FASE 2: Operador $or (6 ejercicios)](#-fase-2-operador-or-nivel-intermedio)
- [🎯 FASE 3: Operadores $nor y $not (4 ejercicios)](#-fase-3-operadores-nor-y-not-nivel-avanzado)
- [🎯 FASE 4: Operador $match en Aggregation (6 ejercicios)](#-fase-4-operador-match-en-aggregation-nivel-intermedio-avanzado)
- [🎯 FASE 5: Operadores $exists, $type y $regex (9 ejercicios)](#-fase-5-operadores-exists-y-type-nivel-avanzado)
- [🎯 FASE 6: Consultas Complejas Combinadas (5 ejercicios)](#-fase-6-consultas-complejas-combinadas-nivel-avanzado)
- [🎯 FASE 7: Operadores de Expresión (47 ejercicios)](#-fase-7-operadores-de-expresión-nivel-intermedio-avanzado)
- [🎯 FASE 8: Ejercicios Combinados CRUD + Operadores (10 ejercicios)](#-fase-8-ejercicios-combinados-crud--operadores-nivel-avanzado)

### Referencias
- [📊 Resumen de Ejercicios por Fase](#-resumen-de-ejercicios-por-fase)
- [✅ Checklist de Verificación](#-checklist-de-verificación)
- [💡 Consejos](#-consejos)
- [📚 Recursos Adicionales](#-recursos-adicionales)

### Archivos Relacionados
- 📖 [Material Teórico](./Clase-2-Operadores-Logicos-y-Match.md)
- ✅ [Ejercicios - Soluciones](./Clase-2-Ejercicios-Practicos.md)

---

## 📋 Preparación: Set de Datos

Antes de comenzar, asegúrate de tener la base de datos `escuela` con los siguientes datos:

```javascript
// 1. Seleccionar/crear base de datos
use escuela

// 2. Insertar estudiantes
db.estudiantes.insertMany([
  {
    nombre: "Roberto",
    apellido: "Silva",
    email: "roberto.silva@example.com",
    edad: 22,
    fechaNacimiento: new Date("2002-06-10"),
    ciudad: "Buenos Aires",
    activo: true
  },
  {
    nombre: "Carmen",
    apellido: "Vargas",
    email: "carmen.vargas@example.com",
    edad: 21,
    fechaNacimiento: new Date("2003-04-22"),
    ciudad: "Córdoba",
    activo: true
  },
  {
    nombre: "Fernando",
    apellido: "Morales",
    email: "fernando.morales@example.com",
    edad: 20,
    fechaNacimiento: new Date("2004-08-15"),
    ciudad: "Buenos Aires",
    activo: true
  },
  {
    nombre: "Lucía",
    apellido: "Jiménez",
    email: "lucia.jimenez@example.com",
    edad: 19,
    fechaNacimiento: new Date("2005-02-28"),
    ciudad: "Rosario",
    activo: false
  },
  {
    nombre: "Miguel",
    apellido: "Castro",
    email: "miguel.castro@example.com",
    edad: 24,
    fechaNacimiento: new Date("2000-12-05"),
    ciudad: "Mendoza",
    activo: true
  },
  {
    nombre: "Elena",
    apellido: "Ruiz",
    email: "elena.ruiz@example.com",
    edad: 20,
    fechaNacimiento: new Date("2004-09-18"),
    ciudad: "Buenos Aires",
    activo: true
  },
  {
    nombre: "Andrés",
    apellido: "Mendoza",
    email: "andres.mendoza@example.com",
    edad: 18,
    fechaNacimiento: new Date("2006-03-12"),
    ciudad: "Córdoba",
    activo: false
  },
  {
    nombre: "Valentina",
    apellido: "Herrera",
    email: "valentina.herrera@example.com",
    edad: 21,
    fechaNacimiento: new Date("2003-11-08"),
    ciudad: "Rosario",
    activo: true
  },
  {
    nombre: "Sebastián",
    apellido: "Ortega",
    email: "sebastian.ortega@gmail.com",
    edad: 25,
    ciudad: "Buenos Aires",
    activo: true,
    telefono: "011-4567-8901"
  },
  {
    nombre: "Isabella",
    apellido: "Díaz",
    email: "isabella.diaz@example.com",
    edad: 23,
    ciudad: "Córdoba",
    activo: true,
    telefono: "0351-2345-6789"
  }
]);

// 3. Insertar materias
db.materias.insertMany([
  {
    nombre: "Física",
    codigo: "FIS201",
    creditos: 6,
    docente: "Dr. Ramírez"
  },
  {
    nombre: "Desarrollo Web",
    codigo: "WEB301",
    creditos: 8,
    docente: "Ing. Torres"
  },
  {
    nombre: "Sistemas Operativos",
    codigo: "SO401",
    creditos: 7,
    docente: "Lic. Moreno"
  },
  {
    nombre: "Estructuras de Datos",
    codigo: "ED302",
    creditos: 6,
    docente: "Dr. Suárez"
  },
  {
    nombre: "Seguridad Informática",
    codigo: "SI501",
    creditos: 5,
    docente: "Ing. Vega"
  }
]);
```

---

## 🎯 FASE 1: Operador $and (Nivel Intermedio)

### Ejercicio A1: $and Explícito
**Consigna**: Buscar todos los estudiantes que están activos **Y** tienen más de 22 años, usando el operador `$and` explícitamente.

**💡 Pista**: Usa `$and` con un array de condiciones: `$and: [{ activo: true }, { edad: { $gt: 22 } }]`

db.estudiantes.find({ $and: [{activo: true}, {edad: { $gt: 22 }}] })
---

### Ejercicio A2: $and Implícito
**Consigna**: Buscar todos los estudiantes que están activos **Y** tienen más de 22 años, usando `$and` implícito (sin escribir `$and`).

**💡 Pista**: Simplemente coloca múltiples condiciones en el mismo objeto de consulta.

b.estudiantes.find({ activo: true, edad: {$gt: 22} } )
---

### Ejercicio A3: Múltiples Condiciones con $and
**Consigna**: Buscar estudiantes que son de "Buenos Aires" **Y** están activos **Y** tienen entre 20 y 25 años (inclusive ambos).

**💡 Pista**: Usa `$and` con tres condiciones, y para el rango de edad usa `$gte` y `$lte`.

db.estudiantes.find({ $and: [ {ciudad: "Buenos Aires"}, { activo: true }, { edad: { $gte: 20, $lte: 25 } } ] })
---

### Ejercicio A4: $and con Mismo Campo
**Consigna**: Buscar estudiantes cuya edad es mayor a 20 **Y** menor a 25, usando `$and` explícito.

**💡 Pista**: Aunque puedes usar `{ edad: { $gt: 20, $lt: 25 } }`, intenta usar `$and` con dos condiciones separadas en el mismo campo.

---

### Ejercicio A5: $and Anidado con $or
**Consigna**: Buscar estudiantes que están activos **Y** (son de "Buenos Aires" **O** tienen más de 25 años).

**💡 Pista**: Usa `$and` que contiene un `$or` dentro.

db.estudiantes.find({ $and: [ { activo: true }, { $or: [ { ciudad: "Buenos Aires" }, { edad: { $gt: 25 } } ] } ] })

---

## 🎯 FASE 2: Operador $or (Nivel Intermedio)

### Ejercicio O1: $or Básico
**Consigna**: Buscar todos los estudiantes que viven en "Buenos Aires" **O** en "Córdoba".

**💡 Pista**: Usa `$or` con un array de dos condiciones: `$or: [{ ciudad: "Buenos Aires" }, { ciudad: "Córdoba" }]`

db.estudiantes.find({ $or: [ { ciudad: "Buenos Aires" }, { ciudad: "Córdoba" } ] })

---

### Ejercicio O2: $or con Múltiples Opciones
**Consigna**: Buscar estudiantes que viven en "Buenos Aires", "Córdoba" **O** "Rosario".

**💡 Pista**: Agrega una tercera condición al array de `$or`.


db.estudiantes.find({ $or: [ { ciudad: "Buenos Aires" }, { ciudad: "Córdoba" }, { ciudad: "Rosario" } ] })

---

### Ejercicio O3: $or con Diferentes Campos
**Consigna**: Buscar estudiantes que están activos **O** tienen más de 25 años.

**💡 Pista**: Las condiciones en `$or` pueden ser sobre campos diferentes.

---

### Ejercicio O4: $or vs $in
**Consigna**: Buscar estudiantes de "Buenos Aires", "Córdoba" o "Rosario" usando `$in` en lugar de `$or`.

**💡 Pista**: `$in` es más eficiente cuando todas las condiciones son sobre el mismo campo con igualdad: `{ ciudad: { $in: ["Buenos Aires", "Córdoba", "Rosario"] } }`

db.estudiantes.find({ ciudad: { $in: [ "Buenos Aires", "Córdoba", "Rosario" ] } })
---

### Ejercicio O4B: $nin - Excluir Múltiples Valores
**Consigna**: Buscar estudiantes que **NO** son de "Buenos Aires", "Córdoba" ni "Rosario" usando `$nin`.

**💡 Pista**: `$nin` excluye documentos donde el campo tiene alguno de los valores especificados: `{ ciudad: { $nin: ["Buenos Aires", "Córdoba", "Rosario"] } }`


db.estudiantes.find({ ciudad: { $nin: [ "Buenos Aires", "Córdoba", "Rosario" ] } })
---

### Ejercicio O4C: $nin vs $nor
**Consigna**: Buscar estudiantes que **NO** son de "Buenos Aires" ni "Córdoba" usando `$nor` y luego comparar con `$nin`. Compara ambas soluciones.

**💡 Pista**: 
- Con `$nor`: `{ $nor: [{ ciudad: "Buenos Aires" }, { ciudad: "Córdoba" }] }`
- Con `$nin`: `{ ciudad: { $nin: ["Buenos Aires", "Córdoba"] } }`
- Ambas devuelven los mismos resultados, pero `$nin` es más eficiente para exclusiones múltiples del mismo campo.

---

### Ejercicio O5: $or Combinado con Otras Condiciones
**Consigna**: Buscar estudiantes que están activos **Y** (son de "Buenos Aires" **O** tienen más de 25 años).

**💡 Pista**: Combina una condición simple con un `$or` en el mismo objeto de consulta.

---

### Ejercicio O6: $or Complejo
**Consigna**: Buscar estudiantes que (tienen entre 20 y 22 años) **O** (son de "Mendoza" **Y** están activos).

**💡 Pista**: Usa `$or` con dos condiciones, donde la segunda condición es un `$and` implícito.

---

## 🎯 FASE 3: Operadores $nor y $not (Nivel Avanzado)

### Ejercicio N1: $nor Básico
**Consigna**: Buscar estudiantes que **NO** son de "Buenos Aires" **Y NO** son de "Córdoba".

**💡 Pista**: `$nor` devuelve documentos que NO cumplen ninguna de las condiciones: `$nor: [{ ciudad: "Buenos Aires" }, { ciudad: "Córdoba" }]`

---

### Ejercicio N2: $nor con Múltiples Condiciones
**Consigna**: Buscar estudiantes que **NO** están activos **Y NO** tienen más de 25 años.

**💡 Pista**: Usa `$nor` con condiciones sobre diferentes campos.

db.estudiantes.find({ $nor: [ { activo: true }, {edad: {$gt: 25}} ] })
---

### Ejercicio N3: $not con Operador
**Consigna**: Buscar estudiantes cuya edad **NO** es mayor a 22 años, usando `$not`.

**💡 Pista**: `$not` invierte una condición: `{ edad: { $not: { $gt: 22 } } }`

db.estudiantes.find({ edad: { $not: { $gt: 22 } } })
---

### Ejercicio N4: $not con Regex
**Consigna**: Buscar estudiantes cuyo nombre **NO** empieza con "A", usando `$not` con `$regex`.

**💡 Pista**: `{ nombre: { $not: { $regex: /^A/i } } }`

---

## 🎯 FASE 4: Operador $match en Aggregation (Nivel Intermedio-Avanzado)

### Ejercicio M1: $match Básico
**Consigna**: Usar `$match` en un aggregation pipeline para filtrar estudiantes activos.

**💡 Pista**: `db.estudiantes.aggregate([{ $match: { activo: true } }])`

---

### Ejercicio M2: $match con Múltiples Condiciones
**Consigna**: Usar `$match` para filtrar estudiantes activos mayores de 20 años.

**💡 Pista**: Puedes combinar condiciones en `$match` igual que en `find()`.

---

### Ejercicio M3: $match con $or
**Consigna**: Usar `$match` con `$or` para filtrar estudiantes de "Buenos Aires" o "Córdoba".

**💡 Pista**: `$match` acepta todos los operadores lógicos que funcionan en `find()`.

---

### Ejercicio M4: $match seguido de $count
**Consigna**: Contar cuántos estudiantes activos hay usando `$match` seguido de `$count`.

**💡 Pista**: `db.estudiantes.aggregate([{ $match: { activo: true } }, { $count: "total" }])`

---

### Ejercicio M5: $match seguido de $sort
**Consigna**: Filtrar estudiantes activos mayores de 20 años y ordenarlos por edad ascendente usando `$match` y `$sort`.

**💡 Pista**: Coloca `$match` primero, luego `$sort`: `[{ $match: {...} }, { $sort: { edad: 1 } }]`

---

### Ejercicio M6: $match seguido de $limit
**Consigna**: Filtrar estudiantes activos, ordenarlos por edad descendente, y mostrar solo los 3 primeros usando `$match`, `$sort` y `$limit`.

**💡 Pista**: Orden: `$match` → `$sort` → `$limit`

---

## 🎯 FASE 5: Operadores $exists y $type (Nivel Avanzado)

### Ejercicio E1: $exists - Campo Existe
**Consigna**: Buscar todos los estudiantes que tienen el campo "telefono".

**💡 Pista**: `{ telefono: { $exists: true } }`

db.estudiantes.find( {telefono: { $exists: true }} )
---

### Ejercicio E2: $exists - Campo No Existe
**Consigna**: Buscar todos los estudiantes que **NO** tienen el campo "telefono".

**💡 Pista**: `{ telefono: { $exists: false } }`

db.estudiantes.find( {telefono: { $exists: false }} )
---

### Ejercicio E3: $exists Combinado con Otras Condiciones
**Consigna**: Buscar estudiantes activos que tienen el campo "telefono".

**💡 Pista**: Combina `$exists` con otras condiciones usando `$and` implícito.

---

### Ejercicio T1: $type - Verificar Tipo String
**Consigna**: Buscar estudiantes donde el campo "telefono" es de tipo string.

**💡 Pista**: `{ telefono: { $type: "string" } }`

db.estudiantes.find({ telefono: {$type: "string"} })

---

### Ejercicio T2: $type - Verificar Tipo Number
**Consigna**: Buscar estudiantes donde el campo "edad" es de tipo number.

**💡 Pista**: `{ edad: { $type: "number" } }`

---

### Ejercicio R1: $regex - Validar Formato de Email
**Consigna**: Buscar estudiantes cuyo email tiene un formato válido (contiene un "@" y un "." después del "@"). Usa `$regex` para validar el patrón básico de email.

**💡 Pista**: `{ email: { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i } }`


**db.estudiantes.find({ email: { $regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i } })**
---

### Ejercicio R2: $regex - Buscar Nombres que Empiezan con Letra Específica
**Consigna**: Buscar estudiantes cuyo nombre empieza con "M" o "L" (sin distinguir mayúsculas/minúsculas) usando `$regex`.

**💡 Pista**: `{ nombre: { $regex: /^[ML]/i } }`


db.estudiantes.find({ nombre: { $regex: /^[ML]/i } })
---

### Ejercicio R3: $regex - Buscar Apellidos que Terminan con Texto
**Consigna**: Buscar estudiantes cuyo apellido termina con "ez" (sin distinguir mayúsculas/minúsculas) usando `$regex`.

**💡 Pista**: Usa el símbolo `$` para indicar el fin del string: `{ apellido: { $regex: /z$/i } }`
db.estudiantes.find({ apellido: {$regex: /z$/i } })

---

### Ejercicio R4: $regex - Buscar Texto que Contiene Patrón
**Consigna**: Buscar estudiantes cuyo email contiene "gmail" en cualquier posición (no necesariamente al inicio o al final) usando `$regex`.

**💡 Pista**: Sin usar `^` ni `$`, el patrón busca en cualquier posición: `{ email: { $regex: /gmail/i } }`

---

## 🎯 FASE 6: Consultas Complejas Combinadas (Nivel Avanzado)

### Ejercicio C1: Consulta Compleja 1
**Consigna**: Buscar estudiantes que:
- Están activos **Y**
- (Son de "Buenos Aires" **O** "Córdoba") **Y**
- Tienen entre 20 y 25 años (inclusive)

**💡 Pista**: Combina `$and` implícito con `$or` y rangos.

---

### Ejercicio C2: Consulta Compleja 2
**Consigna**: Buscar estudiantes que:
- (Están activos **O** tienen más de 25 años) **Y**
- **NO** son de "Rosario"

**💡 Pista**: Usa `$or` combinado con `$ne` (not equal).

---

### Ejercicio C3: Consulta Compleja 3
**Consigna**: Usar `$match` en aggregation para filtrar estudiantes que:
- Están activos **Y**
- Tienen el campo "telefono" **Y**
- (Son de "Buenos Aires" **O** tienen más de 23 años)

Luego ordenar por edad descendente y mostrar solo los primeros 5.

**💡 Pista**: Combina `$match` con `$exists`, `$or`, luego `$sort` y `$limit`.

---

### Ejercicio C4: Consulta Compleja 4
**Consigna**: Usar `$match` con `$nor` para encontrar estudiantes que:
- **NO** están inactivos **Y**
- **NO** tienen menos de 18 años

Luego contar cuántos hay.

**💡 Pista**: `$nor` con condiciones negativas puede ser equivalente a condiciones positivas.

---

### Ejercicio C5: Comparación find() vs aggregate()
**Consigna**: 
1. Escribir una consulta con `find()` para estudiantes activos mayores de 20 años, ordenados por edad.
2. Escribir la misma consulta usando `aggregate()` con `$match` y `$sort`.
3. Comparar los resultados (deberían ser iguales).

**💡 Pista**: 
- `find()`: `db.estudiantes.find({ activo: true, edad: { $gt: 20 } }).sort({ edad: 1 })`
- `aggregate()`: `db.estudiantes.aggregate([{ $match: {...} }, { $sort: {...} }])`

---

## 🎯 FASE 7: Operadores de Expresión (Nivel Intermedio-Avanzado)

### Ejercicio EX1: $sum - Contar Documentos
**Consigna**: Usar `$group` con `$sum` para contar cuántos estudiantes hay en cada ciudad.

**💡 Pista**: Usa `$group` con `_id: "$ciudad"` y `total: { $sum: 1 }`.

---

### Ejercicio EX2: $avg - Promedio de Edad
**Consigna**: Calcular el promedio de edad de todos los estudiantes usando `$group` con `$avg`.

**💡 Pista**: Usa `$group` con `_id: null` para agrupar todos los documentos y `promedioEdad: { $avg: "$edad" }`.

---

### Ejercicio EX3: $min y $max - Edad Mínima y Máxima
**Consigna**: Encontrar la edad mínima y máxima de los estudiantes por ciudad usando `$group` con `$min` y `$max`.

**💡 Pista**: Usa `$group` con `_id: "$ciudad"` y agrega `edadMinima: { $min: "$edad" }` y `edadMaxima: { $max: "$edad" }`.

---

### Ejercicio EX4: $count - Contar con Etapa
**Consigna**: Contar cuántos estudiantes activos hay usando `$match` seguido de `$count`.

**💡 Pista**: `db.estudiantes.aggregate([{ $match: { activo: true } }, { $count: "total" }])`

---

### Ejercicio EX5: $add - Sumar Valores
**Consigna**: Usar `$project` con `$add` para crear un campo que muestre la edad del estudiante más 5 años.

**💡 Pista**: `{ edadEn5Anos: { $add: ["$edad", 5] } }`

---

### Ejercicio EX6: $multiply - Multiplicar Créditos
**Consigna**: Usar `$project` con `$multiply` para crear un campo que muestre los créditos de cada materia multiplicados por 2.

**💡 Pista**: `{ creditosDobles: { $multiply: ["$creditos", 2] } }`

---

### Ejercicio EX7: $concat - Nombre Completo
**Consigna**: Usar `$project` con `$concat` para crear un campo "nombreCompleto" que una nombre y apellido con un espacio entre ellos.

**💡 Pista**: `{ nombreCompleto: { $concat: ["$nombre", " ", "$apellido"] } }`

---

### Ejercicio EX8: $toUpper - Nombre en Mayúsculas
**Consigna**: Usar `$project` con `$toUpper` para crear un campo que muestre el nombre del estudiante en mayúsculas.

**💡 Pista**: `{ nombreMayusculas: { $toUpper: "$nombre" } }`

---

### Ejercicio EX9: $cond - Categoría por Edad
**Consigna**: Usar `$project` con `$cond` para crear un campo "categoria" que sea "Mayor" si la edad es >= 21, o "Menor" si es < 21.

**💡 Pista**: 
```javascript
{
  categoria: {
    $cond: {
      if: { $gte: ["$edad", 21] },
      then: "Mayor",
      else: "Menor"
    }
  }
}
```

---

### Ejercicio EX10: $ifNull - Valor por Defecto
**Consigna**: Usar `$project` con `$ifNull` para mostrar el teléfono del estudiante, o "Sin teléfono" si no tiene.

**💡 Pista**: `{ telefono: { $ifNull: ["$telefono", "Sin teléfono"] } }`

---

### Ejercicio EX11: $group Completo - Estadísticas por Ciudad
**Consigna**: Usar `$group` para calcular por ciudad: total de estudiantes, promedio de edad, edad mínima y edad máxima. Luego ordenar por total descendente.

**💡 Pista**: Combina `$group` con múltiples operadores de agregación y luego `$sort`.

---

### Ejercicio EX12: $project Completo - Transformar Datos
**Consigna**: Usar `$project` para crear un documento con:
- nombreCompleto (concat de nombre y apellido)
- edad
- edadEn10Anos (edad + 10)
- categoria (Mayor si >= 21, Menor si < 21)
- telefono (con valor por defecto si no existe)

**💡 Pista**: Combina múltiples operadores de expresión en un solo `$project`.

---

### Ejercicio EX13: $match + $group - Estadísticas de Activos
**Consigna**: Filtrar estudiantes activos con `$match`, luego agrupar por ciudad y calcular total y promedio de edad.

**💡 Pista**: Combina `$match` con `$group` usando `$sum` y `$avg`.

---

### Ejercicio EX14: $group + $project - Transformar Resultados
**Consigna**: Agrupar materias para calcular total de créditos y promedio, luego usar `$project` para renombrar `_id` a "resumen" y redondear el promedio.

**💡 Pista**: Usa `$group` primero, luego `$project` para transformar los resultados.

---

### Ejercicio EX15: Pipeline Completo - Top Ciudades
**Consigna**: Crear un pipeline que:
1. Filtre estudiantes activos
2. Agrupe por ciudad contando total
3. Ordene por total descendente
4. Limite a las 3 ciudades con más estudiantes

**💡 Pista**: Combina `$match`, `$group`, `$sort` y `$limit`.

---

### Ejercicio EX16: $sum - Sumar Créditos por Docente
**Consigna**: Agrupar materias por docente y sumar todos los créditos que imparte cada docente usando `$sum` con un campo.

**💡 Pista**: Usa `$group` con `_id: "$docente"` y `totalCreditos: { $sum: "$creditos" }`.

---

### Ejercicio EX17: $sum - Sumar Múltiples Valores en $project
**Consigna**: Usar `$project` con `$sum` para crear un campo que sume la edad del estudiante más 10 más 5 (edad + 10 + 5).

**💡 Pista**: `{ total: { $sum: ["$edad", 10, 5] } }`

---

### Ejercicio EX18: $avg - Promedio de Créditos por Docente
**Consigna**: Agrupar materias por docente y calcular el promedio de créditos que imparte cada docente.

**💡 Pista**: Usa `$group` con `_id: "$docente"` y `promedioCreditos: { $avg: "$creditos" }`.

---

### Ejercicio EX19: $avg - Promedio de Edad por Estado
**Consigna**: Agrupar estudiantes por estado (activo/inactivo) y calcular el promedio de edad de cada grupo.

**💡 Pista**: Usa `$group` con `_id: "$activo"` y `promedioEdad: { $avg: "$edad" }`.

---

### Ejercicio EX20: $min - Créditos Mínimos por Docente
**Consigna**: Agrupar materias por docente y encontrar la materia con menos créditos que imparte cada docente.

**💡 Pista**: Usa `$group` con `_id: "$docente"` y `minimoCreditos: { $min: "$creditos" }`.

---

### Ejercicio EX21: $max - Edad Máxima por Ciudad y Estado
**Consigna**: Agrupar estudiantes por ciudad y estado activo, y encontrar la edad máxima en cada combinación.

**💡 Pista**: Usa `$group` con `_id: { ciudad: "$ciudad", activo: "$activo" }` y `edadMaxima: { $max: "$edad" }`.

---

### Ejercicio EX22: $count - Contar Materias con Más de 6 Créditos
**Consigna**: Filtrar materias con más de 6 créditos y contar cuántas hay usando `$match` y `$count`.

**💡 Pista**: `db.materias.aggregate([{ $match: { creditos: { $gt: 6 } } }, { $count: "total" }])`

---

### Ejercicio EX23: $count - Contar Estudiantes por Rango de Edad
**Consigna**: Filtrar estudiantes entre 20 y 25 años (inclusive) y contar cuántos hay.

**💡 Pista**: Combina `$match` con rango de edad y `$count`.

---

### Ejercicio EX24: $subtract - Calcular Diferencia de Edad
**Consigna**: Usar `$project` con `$subtract` para crear un campo que calcule cuántos años faltan para llegar a 30 años (30 - edad).

**💡 Pista**: `{ añosPara30: { $subtract: [30, "$edad"] } }`

---

### Ejercicio EX25: $subtract - Diferencia entre Créditos y Mínimo
**Consigna**: Usar `$project` para calcular cuántos créditos más tiene cada materia respecto a 5 créditos (creditos - 5).

**💡 Pista**: `{ creditosExtra: { $subtract: ["$creditos", 5] } }`

---

### Ejercicio EX26: $divide - Calcular Créditos por Semestre
**Consigna**: Usar `$project` con `$divide` para calcular cuántos créditos por semestre tiene cada materia (asumiendo que un semestre tiene 2 créditos base, dividir créditos entre 2).

**💡 Pista**: `{ creditosPorSemestre: { $divide: ["$creditos", 2] } }`

---

### Ejercicio EX27: $divide - Calcular Porcentaje de Edad
**Consigna**: Usar `$project` para calcular qué porcentaje representa la edad del estudiante respecto a 100 años (edad / 100).

**💡 Pista**: `{ porcentajeEdad: { $divide: ["$edad", 100] } }`

---

### Ejercicio EX28: $toLower - Email Normalizado
**Consigna**: Usar `$project` con `$toLower` para crear un campo "emailNormalizado" que muestre el email del estudiante en minúsculas.

**💡 Pista**: `{ emailNormalizado: { $toLower: "$email" } }`

---

### Ejercicio EX29: $toLower - Nombre Completo en Minúsculas
**Consigna**: Usar `$project` para crear un campo "nombreCompletoMinusculas" que concatene nombre y apellido, y luego convertir todo a minúsculas usando `$toLower` con `$concat`.

**💡 Pista**: Anida `$toLower` con `$concat`: `{ nombreCompletoMinusculas: { $toLower: { $concat: ["$nombre", " ", "$apellido"] } } }`

---

### Ejercicio EX30: $substr - Extraer Código de Materia
**Consigna**: Usar `$project` con `$substr` para extraer las primeras 3 letras del código de cada materia (por ejemplo, "MAT" de "MAT101").

**💡 Pista**: `{ prefijoCodigo: { $substr: ["$codigo", 0, 3] } }`

---

### Ejercicio EX31: $substr - Iniciales del Nombre
**Consigna**: Usar `$project` para crear un campo "inicial" que extraiga solo la primera letra del nombre del estudiante.

**💡 Pista**: `{ inicial: { $substr: ["$nombre", 0, 1] } }`

---

### Ejercicio EX32: $cond - Clasificación de Créditos
**Consigna**: Usar `$project` con `$cond` para crear un campo "nivel" que sea "Alto" si los créditos son >= 7, "Medio" si son >= 5, o "Bajo" si son < 5. Usa `$cond` anidado.

**💡 Pista**: Anida `$cond` dentro de otro `$cond` para múltiples condiciones.

---

### Ejercicio EX33: $cond - Rango de Edad con Múltiples Categorías
**Consigna**: Usar `$project` con `$cond` anidado para crear un campo "rangoEdad" que sea:
- "Joven" si edad < 20
- "Adulto" si edad >= 20 y < 25
- "Mayor" si edad >= 25

**💡 Pista**: Usa `$cond` anidado: primero verifica si es >= 25, si no, verifica si es >= 20.

---

### Ejercicio EX34: $ifNull - Ciudad con Valor por Defecto
**Consigna**: Usar `$project` con `$ifNull` para mostrar la ciudad del estudiante, o "No especificada" si no tiene ciudad.

**💡 Pista**: `{ ciudad: { $ifNull: ["$ciudad", "No especificada"] } }`

---

### Ejercicio EX35: $ifNull - Email con Valor por Defecto
**Consigna**: Usar `$project` para crear un campo "emailContacto" que muestre el email del estudiante, o un email genérico "sin-email@escuela.com" si no tiene email.

**💡 Pista**: `{ emailContacto: { $ifNull: ["$email", "sin-email@escuela.com"] } }`

---

### Ejercicio EX36: Operadores de Comparación - Verificar Mayoría de Edad
**Consigna**: Usar `$project` con operadores de comparación para crear un campo booleano "esMayorDeEdad" que sea `true` si la edad es >= 18, o `false` si no.

**💡 Pista**: `{ esMayorDeEdad: { $gte: ["$edad", 18] } }`

---

### Ejercicio EX37: Operadores de Comparación - Comparar Créditos
**Consigna**: Usar `$project` para crear un campo booleano "tieneMuchosCreditos" que sea `true` si los créditos son > 6, o `false` si no.

**💡 Pista**: `{ tieneMuchosCreditos: { $gt: ["$creditos", 6] } }`

---

### Ejercicio EX38: $gt - Verificar Edad Mayor
**Consigna**: Usar `$project` con `$gt` para crear un campo booleano "esMayorDe25" que sea `true` si la edad es mayor a 25, o `false` si no.

**💡 Pista**: `{ esMayorDe25: { $gt: ["$edad", 25] } }`

---

### Ejercicio EX39: $gte - Verificar Créditos Mínimos
**Consigna**: Usar `$project` con `$gte` para crear un campo booleano "cumpleMinimo" que sea `true` si los créditos son >= 6, o `false` si no.

**💡 Pista**: `{ cumpleMinimo: { $gte: ["$creditos", 6] } }`

---

### Ejercicio EX40: $lt - Verificar Edad Menor
**Consigna**: Usar `$project` con `$lt` para crear un campo booleano "esMenorDe21" que sea `true` si la edad es menor a 21, o `false` si no.

**💡 Pista**: `{ esMenorDe21: { $lt: ["$edad", 21] } }`

---

### Ejercicio EX41: $lt - Verificar Créditos Bajos
**Consigna**: Usar `$project` con `$lt` para crear un campo booleano "tienePocosCreditos" que sea `true` si los créditos son < 6, o `false` si no.

**💡 Pista**: `{ tienePocosCreditos: { $lt: ["$creditos", 6] } }`

---

### Ejercicio EX42: $lte - Verificar Edad Máxima
**Consigna**: Usar `$project` con `$lte` para crear un campo booleano "esMenorOIgualA22" que sea `true` si la edad es <= 22, o `false` si no.

**💡 Pista**: `{ esMenorOIgualA22: { $lte: ["$edad", 22] } }`

---

### Ejercicio EX43: $lte - Verificar Créditos Máximos
**Consigna**: Usar `$project` con `$lte` para crear un campo booleano "dentroDelLimite" que sea `true` si los créditos son <= 7, o `false` si no.

**💡 Pista**: `{ dentroDelLimite: { $lte: ["$creditos", 7] } }`

---

### Ejercicio EX44: $eq - Verificar Igualdad de Edad
**Consigna**: Usar `$project` con `$eq` para crear un campo booleano "tiene20Anos" que sea `true` si la edad es exactamente 20, o `false` si no.

**💡 Pista**: `{ tiene20Anos: { $eq: ["$edad", 20] } }`

---

### Ejercicio EX45: $eq - Verificar Créditos Exactos
**Consigna**: Usar `$project` con `$eq` para crear un campo booleano "tiene6Creditos" que sea `true` si los créditos son exactamente 6, o `false` si no.

**💡 Pista**: `{ tiene6Creditos: { $eq: ["$creditos", 6] } }`

---

### Ejercicio EX46: $ne - Verificar Diferencia de Edad
**Consigna**: Usar `$project` con `$ne` para crear un campo booleano "noTiene20Anos" que sea `true` si la edad NO es 20, o `false` si es 20.

**💡 Pista**: `{ noTiene20Anos: { $ne: ["$edad", 20] } }`

---

### Ejercicio EX47: $ne - Verificar Diferencia de Créditos
**Consigna**: Usar `$project` con `$ne` para crear un campo booleano "noTiene6Creditos" que sea `true` si los créditos NO son 6, o `false` si son 6.

**💡 Pista**: `{ noTiene6Creditos: { $ne: ["$creditos", 6] } }`

---

## 🎯 FASE 8: Ejercicios Combinados CRUD + Operadores (Nivel Avanzado)

### Ejercicio CO1: Consulta Compleja con Actualización
**Consigna**: 
1. Buscar todos los estudiantes activos mayores de 22 años usando `find()`.
2. Luego actualizar a esos estudiantes agregándoles un campo "categoria" con valor "avanzado" usando `updateMany()`.

**💡 Pista**: Primero verifica la consulta con `find()`, luego usa la misma condición en `updateMany()` con `$set`.

---

### Ejercicio CO2: Pipeline con Transformación y Actualización
**Consigna**: 
1. Usar `aggregate()` con `$match` y `$project` para encontrar estudiantes activos y crear un campo calculado "edadEn5Anos" (edad + 5).
2. Luego, basándote en los resultados, actualizar esos estudiantes agregándoles el campo "edadFutura" con el valor calculado.

**💡 Pista**: Primero ejecuta el aggregate para ver los resultados, luego usa `updateMany()` con la misma condición de `$match` y calcula el valor con `$add` en la actualización.

---

### Ejercicio CO3: Agrupar, Filtrar y Actualizar
**Consigna**: 
1. Agrupar estudiantes por ciudad y calcular el promedio de edad por ciudad.
2. Identificar las ciudades con promedio mayor a 21 años.
3. Actualizar a todos los estudiantes de esas ciudades agregándoles un campo "ciudadDestacada" con valor `true`.

**💡 Pista**: Usa `$group` para calcular promedios, luego `$match` para filtrar ciudades con promedio > 21, y finalmente `updateMany()` con `$in` en las ciudades encontradas.

---

### Ejercicio CO4: Consulta con Eliminación Condicional
**Consigna**: 
1. Buscar estudiantes que NO están activos Y tienen más de 25 años usando `find()`.
2. Verificar cuántos son con `countDocuments()`.
3. Eliminar esos estudiantes usando `deleteMany()`.

**💡 Pista**: Combina `$nor` o `$and` con condiciones negativas para encontrar estudiantes inactivos mayores de 25.

---

### Ejercicio CO5: Pipeline Completo con Estadísticas y Actualización
**Consigna**: 
1. Crear un pipeline que agrupe materias por docente, calcule total de créditos y promedio.
2. Filtrar docentes con promedio de créditos >= 6.
3. Para cada materia de esos docentes, actualizar agregando un campo "docenteDestacado" con valor `true`.

**💡 Pista**: Usa `$group`, `$match`, luego identifica las materias de esos docentes y actualiza con `updateMany()` usando `$in` en el campo docente.

---

### Ejercicio CO6: Transformación Compleja con Actualización
**Consigna**: 
1. Usar `aggregate()` con `$project` para crear documentos con nombreCompleto (concat), categoria (cond por edad), y telefono (ifNull).
2. Basándote en los resultados, actualizar los estudiantes:
   - Si no tienen telefono, agregarles "telefono" con valor "000-0000-0000"
   - Si tienen categoria "Mayor", agregarles "descuento" con valor 10

**💡 Pista**: Usa dos `updateMany()` separados: uno con `$exists: false` para telefono, otro con una condición basada en edad >= 21.

---

### Ejercicio CO7: Consulta, Conteo y Eliminación Selectiva
**Consigna**: 
1. Buscar estudiantes que tienen el campo "telefono" Y son de "Buenos Aires" usando `find()`.
2. Contar cuántos son.
3. Eliminar solo los que tienen más de 24 años de ese grupo.

**💡 Pista**: Combina `$exists`, igualdad de ciudad, y `$gt` en edad para la eliminación.

---

### Ejercicio CO8: Estadísticas por Grupo y Actualización Masiva
**Consigna**: 
1. Agrupar estudiantes por ciudad y calcular estadísticas (total, promedio, min, max de edad).
2. Identificar la ciudad con más estudiantes.
3. Incrementar la edad de todos los estudiantes de esa ciudad en 1 año.

**💡 Pista**: Usa `$group` y `$sort`, identifica la ciudad con más estudiantes, luego `updateMany()` con `$inc` en esa ciudad.

---

### Ejercicio CO9: Pipeline con Filtrado y Actualización Condicional
**Consigna**: 
1. Filtrar estudiantes activos mayores de 20 años.
2. Agrupar por ciudad y calcular promedio de edad.
3. Para ciudades con promedio >= 22, actualizar a todos sus estudiantes agregándoles "ciudadPromedioAlto" con valor `true`.

**💡 Pista**: Combina `$match`, `$group`, `$match` nuevamente para filtrar ciudades, luego `updateMany()` con `$in` en las ciudades encontradas.

---

### Ejercicio CO10: Consulta Compleja, Transformación y Eliminación
**Consigna**: 
1. Buscar estudiantes que (son activos O tienen más de 25 años) Y NO son de "Rosario".
2. Usar `aggregate()` con `$project` para crear un campo "riesgo" que sea "alto" si edad > 24, "medio" si edad >= 20, o "bajo" si no.
3. Eliminar todos los estudiantes con "riesgo" = "alto" (usando la condición de edad directamente en `deleteMany()`).

**💡 Pista**: Combina `$or`, `$ne`, luego usa `$cond` anidado en `$project`, y finalmente `deleteMany()` con `$gt: 24`.

---

## 📊 Resumen de Ejercicios por Fase

| Fase | Nivel | Operadores | Cantidad | Conceptos Clave |
|------|-------|------------|----------|-----------------|
| **FASE 1** | Intermedio | $and | 5 ejercicios | $and explícito, $and implícito, anidación |
| **FASE 2** | Intermedio | $or, $in, $nin | 8 ejercicios | $or básico, $or vs $in, $nin para exclusiones, $nin vs $nor, combinaciones |
| **FASE 3** | Avanzado | $nor, $not | 4 ejercicios | Negación lógica, $not con regex |
| **FASE 4** | Intermedio-Avanzado | $match | 6 ejercicios | Aggregation pipeline, $match con otras etapas |
| **FASE 5** | Avanzado | $exists, $type, $regex | 9 ejercicios | Verificar existencia y tipo de campos, validación con regex, búsquedas de texto (comienza con, termina con, contiene) |
| **FASE 6** | Avanzado | Combinados | 5 ejercicios | Consultas complejas, find() vs aggregate() |
| **FASE 7** | Intermedio-Avanzado | Operadores de Expresión | 47 ejercicios | $sum, $avg, $min, $max, $count, $add, $subtract, $multiply, $divide, $concat, $toUpper, $toLower, $substr, $cond, $ifNull, operadores de comparación ($gt, $gte, $lt, $lte, $eq, $ne), $group, $project |
| **FASE 8** | Avanzado | Combinados CRUD + Operadores | 10 ejercicios | Consultas complejas, actualizaciones basadas en consultas, eliminaciones condicionales, pipelines con transformaciones |

**Total**: 94 ejercicios prácticos para la segunda clase

---

## ✅ Checklist de Verificación

Al finalizar estos ejercicios, deberías poder:

- [ ] Usar `$and` explícito e implícito correctamente
- [ ] Construir consultas con `$or` para condiciones alternativas
- [ ] Usar `$in` para búsquedas por múltiples valores del mismo campo
- [ ] Usar `$nin` para excluir múltiples valores del mismo campo
- [ ] Entender y usar `$nor` y `$not` cuando sea necesario
- [ ] Entender la diferencia entre `$nin` y `$nor` para exclusiones múltiples
- [ ] Combinar múltiples operadores lógicos en consultas complejas
- [ ] Usar `$match` en aggregation pipeline
- [ ] Entender la diferencia entre `find()` y `aggregate()` con `$match`
- [ ] Usar `$exists` para verificar existencia de campos
- [ ] Usar `$type` para verificar tipos de datos
- [ ] Optimizar consultas colocando `$match` al inicio del pipeline
- [ ] Construir consultas complejas paso a paso
- [ ] Usar operadores de agregación (`$sum`, `$avg`, `$min`, `$max`, `$count`) en `$group`
- [ ] Usar operadores aritméticos (`$add`, `$subtract`, `$multiply`, `$divide`) en `$project`
- [ ] Usar operadores de string (`$concat`, `$toUpper`, `$toLower`, `$substr`) para transformar texto
- [ ] Usar operadores condicionales (`$cond` anidado, `$ifNull`) para lógica condicional
- [ ] Usar operadores de comparación en expresiones (`$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`)
- [ ] Usar `$regex` para validar formatos (email, patrones de texto)
- [ ] Usar `$regex` con `^` para buscar texto que comienza con un patrón
- [ ] Usar `$regex` con `$` para buscar texto que termina con un patrón
- [ ] Usar `$regex` sin anclajes para buscar texto que contiene un patrón
- [ ] Combinar múltiples etapas del pipeline (`$match`, `$group`, `$project`, `$sort`, `$limit`)
- [ ] Anidar operadores de expresión para crear cálculos complejos
- [ ] Combinar consultas complejas con operaciones de actualización
- [ ] Usar pipelines de agregación para analizar datos antes de actualizar
- [ ] Verificar y contar documentos antes de eliminar
- [ ] Usar sintaxis de pipeline en `updateMany()` para operadores de expresión

---

## 💡 Consejos

1. **$and es implícito**: No necesitas escribir `$and` cuando tienes múltiples condiciones en el mismo objeto
2. **$or debe ser explícito**: Siempre requiere la sintaxis `$or: [...]`
3. **$match optimiza**: Colócalo al inicio del pipeline para mejor rendimiento
4. **Construye paso a paso**: Empieza con condiciones simples y agrega complejidad gradualmente
5. **Prueba consultas**: Verifica resultados después de cada modificación
6. **Usa .pretty()**: Formatea la salida para mejor legibilidad
7. **Compara find() vs aggregate()**: Entiende cuándo usar cada uno

---

## 📚 Recursos Adicionales

- **Soluciones completas**: Consulta `Clase-2-Ejercicios-Practicos.md`
- **Material completo**: Consulta `Clase-2-Operadores-Logicos-y-Match.md`
- **Documentación oficial**: [https://docs.mongodb.com/manual/reference/operator/query-logical/](https://docs.mongodb.com/manual/reference/operator/query-logical/)
