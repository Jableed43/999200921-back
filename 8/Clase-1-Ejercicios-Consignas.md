# Ejercicios Prácticos - Clase 1: Introducción a MongoDB
## Consignas para Estudiantes

**Base de Datos**: `escuela`  
**Colecciones**: `estudiantes` y `materias`

---

## 📋 Preparación: Set de Datos

Antes de comenzar, asegúrate de tener la base de datos `escuela` con los siguientes datos:

```javascript
// 1. Seleccionar/crear base de datos
use escuela

// 2. Insertar estudiantes
db.estudiantes.insertMany([
  {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    edad: 20,
    fechaNacimiento: new Date("2004-05-15"),
    ciudad: "Buenos Aires",
    activo: true
  },
  {
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@example.com",
    edad: 22,
    fechaNacimiento: new Date("2002-03-20"),
    ciudad: "Córdoba",
    activo: true
  },
  {
    nombre: "Carlos",
    apellido: "López",
    email: "carlos.lopez@example.com",
    edad: 21,
    fechaNacimiento: new Date("2003-07-10"),
    ciudad: "Buenos Aires",
    activo: true
  },
  {
    nombre: "Ana",
    apellido: "Martínez",
    email: "ana.martinez@example.com",
    edad: 19,
    fechaNacimiento: new Date("2005-01-25"),
    ciudad: "Rosario",
    activo: false
  },
  {
    nombre: "Luis",
    apellido: "Rodríguez",
    email: "luis.rodriguez@example.com",
    edad: 23,
    fechaNacimiento: new Date("2001-11-30"),
    ciudad: "Mendoza",
    activo: true
  },
  {
    nombre: "Laura",
    apellido: "Fernández",
    email: "laura.fernandez@example.com",
    edad: 20,
    fechaNacimiento: new Date("2004-08-12"),
    ciudad: "Buenos Aires",
    activo: true
  },
  {
    nombre: "Pedro",
    apellido: "Sánchez",
    email: "pedro.sanchez@example.com",
    edad: 18,
    fechaNacimiento: new Date("2006-02-18"),
    ciudad: "Córdoba",
    activo: false
  },
  {
    nombre: "Sofía",
    apellido: "Torres",
    email: "sofia.torres@example.com",
    edad: 21,
    fechaNacimiento: new Date("2003-09-05"),
    ciudad: "Rosario",
    activo: true
  }
]);

// 3. Insertar materias
db.materias.insertMany([
  {
    nombre: "Matemáticas",
    codigo: "MAT101",
    creditos: 6,
    docente: "Dr. García"
  },
  {
    nombre: "Programación",
    codigo: "PROG201",
    creditos: 8,
    docente: "Ing. Martínez"
  },
  {
    nombre: "Base de Datos",
    codigo: "BD301",
    creditos: 6,
    docente: "Lic. López"
  },
  {
    nombre: "Algoritmos",
    codigo: "ALG202",
    creditos: 7,
    docente: "Dr. Fernández"
  },
  {
    nombre: "Redes",
    codigo: "RED401",
    creditos: 5,
    docente: "Ing. Sánchez"
  }
]);
```

---

## 🎯 FASE 1: CRUD Básico (Nivel Inicial)

### CREATE - Crear Documentos

#### Ejercicio C1
**Consigna**: Insertar un nuevo estudiante con los siguientes datos (falta fecha nacimiento):
- Nombre: "Roberto"
- Apellido: "Pérez"
- Email: "roberto.perez@example.com"
- Edad: 24
- Ciudad: "Mendoza"
- Activo: true

**💡 Pista**: Usa `insertOne()` para insertar un solo documento.

---

#### Ejercicio C2
**Consigna**: Insertar una nueva materia con los siguientes datos:
- Nombre: "Inglés Técnico"
- Código: "ING501"
- Créditos: 4
- Docente: "Prof. Smith"

**💡 Pista**: Usa `insertOne()` en la colección `materias`.

---

#### Ejercicio C3
**Consigna**: Insertar dos estudiantes nuevos en una sola operación:
1. Patricia González, email: "patricia.gonzalez@example.com", edad: 23, ciudad: "Córdoba", activo: true
2. Diego Ramírez, email: "diego.ramirez@example.com", edad: 26, ciudad: "Buenos Aires", activo: true

**💡 Pista**: Usa `insertMany()` con un array de documentos.

---

### READ - Leer Documentos

#### Ejercicio R1
**Consigna**: Ver todos los estudiantes de la colección.

**💡 Pista**: Usa `find()` sin parámetros.

---

#### Ejercicio R2
**Consigna**: Ver todos los estudiantes con formato legible (más fácil de leer).

**💡 Pista**: Usa `find()` seguido de `.pretty()`.

---

#### Ejercicio R3
**Consigna**: Ver todas las materias con formato legible.

**💡 Pista**: Similar al ejercicio anterior, pero en la colección `materias`.

---

#### Ejercicio R4
**Consigna**: Buscar un estudiante cuyo nombre sea exactamente "Ana".

**💡 Pista**: Usa `findOne()` con un filtro `{ nombre: "Ana" }`.

---

#### Ejercicio R5
**Consigna**: Buscar una materia cuyo código sea "MAT101".

**💡 Pista**: Usa `findOne()` con un filtro por código.

---

#### Ejercicio R6
**Consigna**: Contar cuántos estudiantes hay en total en la colección.

**💡 Pista**: Usa `countDocuments()` sin parámetros.

---

#### Ejercicio R7
**Consigna**: Contar cuántas materias hay en total.

**💡 Pista**: Similar al ejercicio anterior, pero en la colección `materias`.

---

#### Ejercicio R8
**Consigna**: Buscar todos los estudiantes que viven en "Buenos Aires".

**💡 Pista**: Usa `find()` con un filtro `{ ciudad: "Buenos Aires" }`.

---

#### Ejercicio R9
**Consigna**: Buscar todos los estudiantes que están activos.

**💡 Pista**: Usa `find()` con un filtro `{ activo: true }`.

---

### UPDATE - Actualizar Documentos

#### Ejercicio U1
**Consigna**: Actualizar la edad del estudiante llamado "Ana" a 23 años.

**💡 Pista**: Usa `updateOne()` con:
- Filtro: `{ nombre: "Ana" }`
- Operador: `$set` para establecer el nuevo valor

---

#### Ejercicio U2
**Consigna**: Actualizar los créditos de la materia con código "MAT101" a 7 créditos.

**💡 Pista**: Usa `updateOne()` en la colección `materias` con el operador `$set`.

---

#### Ejercicio U3
**Consigna**: Cambiar el docente de la materia "Programación" a "Ing. Rodríguez".

**💡 Pista**: Similar al ejercicio anterior, filtra por nombre y actualiza el campo `docente`.

---

#### Ejercicio U4
**Consigna**: Agregar un campo nuevo llamado "telefono" con valor "1234567890" al estudiante llamado "María".

**💡 Pista**: Usa `updateOne()` con `$set` para agregar un campo nuevo.

---

### DELETE - Eliminar Documentos

#### Ejercicio D1
**Consigna**: Eliminar el estudiante llamado "Roberto" (el que insertaste en el ejercicio C1).

**💡 Pista**: Usa `deleteOne()` con un filtro por nombre.

---

#### Ejercicio D2
**Consigna**: Eliminar la materia con código "ING501" (la que insertaste en el ejercicio C2).

**💡 Pista**: Usa `deleteOne()` en la colección `materias` con un filtro por código.

---

## 🎯 FASE 2: Operadores de Comparación (Nivel Intermedio)

### READ con Operadores

#### Ejercicio R10
**Consigna**: Buscar todos los estudiantes que tienen más de 22 años.

**💡 Pista**: Usa el operador `$gt` (greater than) dentro del filtro: `{ edad: { $gt: 22 } }`.

---

#### Ejercicio R11
**Consigna**: Buscar todos los estudiantes que tienen 21 años o menos.

**💡 Pista**: Usa el operador `$lte` (less than or equal) dentro del filtro.

---

#### Ejercicio R12
**Consigna**: Buscar todos los estudiantes que tienen entre 20 y 25 años (inclusive ambos).

**💡 Pista**: Usa los operadores `$gte` (greater than or equal) y `$lte` juntos en el mismo campo.

---

#### Ejercicio R13
**Consigna**: Buscar todas las materias que tienen más de 6 créditos.

**💡 Pista**: Usa el operador `$gt` en el campo `creditos`.

---

#### Ejercicio R14
**Consigna**: Buscar todos los estudiantes que NO están activos.

**💡 Pista**: Usa el operador `$ne` (not equal) o simplemente `{ activo: false }`.

---

#### Ejercicio R15
**Consigna**: Buscar todas las materias que tienen exactamente 6 créditos.

**💡 Pista**: Puedes usar un filtro simple `{ creditos: 6 }` o el operador `$eq`.

---

### UPDATE con Operadores

#### Ejercicio U5
**Consigna**: Incrementar la edad de todos los estudiantes en 1 año.

**💡 Pista**: Usa `updateMany()` con:
- Filtro vacío `{}` para afectar a todos
- Operador `$inc` (increment) para aumentar el valor numérico

---

#### Ejercicio U6
**Consigna**: Incrementar los créditos de todas las materias en 1.

**💡 Pista**: Similar al ejercicio anterior, pero en la colección `materias` y usando `$inc` en el campo `creditos`.

---

#### Ejercicio U7
**Consigna**: Activar todos los estudiantes que están inactivos (cambiar `activo: false` a `activo: true`).

**💡 Pista**: Usa `updateMany()` con:
- Filtro: `{ activo: false }`
- Operador: `$set` para establecer `activo: true`

---

#### Ejercicio U8
**Consigna**: Agregar el campo "telefono" con valor "011-1234-5678" a todos los estudiantes que viven en "Buenos Aires".

**💡 Pista**: Usa `updateMany()` con:
- Filtro: `{ ciudad: "Buenos Aires" }`
- Operador: `$set` para agregar el campo

---

### DELETE con Operadores

#### Ejercicio D3
**Consigna**: Eliminar todos los estudiantes que están inactivos.

**💡 Pista**: Usa `deleteMany()` con un filtro `{ activo: false }`.

---

#### Ejercicio D4
**Consigna**: Eliminar todos los estudiantes que tienen menos de 20 años.

**💡 Pista**: Usa `deleteMany()` con el operador `$lt` (less than) en el campo `edad`.

---

#### Ejercicio D5
**Consigna**: Eliminar todas las materias que tienen menos de 5 créditos.

**💡 Pista**: Similar al ejercicio anterior, pero en la colección `materias` y usando `$lt` en el campo `creditos`.

---

## 🎯 FASE 3: Operadores Lógicos y Proyección (Nivel Avanzado)

### READ con Operadores Lógicos

#### Ejercicio R16
**Consigna**: Buscar todos los estudiantes que están activos Y tienen más de 22 años.

**💡 Pista**: Puedes usar múltiples condiciones en el mismo objeto de filtro, o usar el operador `$and` explícitamente.

---

#### Ejercicio R17
**Consigna**: Buscar todos los estudiantes que viven en "Buenos Aires" O en "Córdoba".

**💡 Pista**: Usa el operador `$or` con un array de condiciones: `$or: [{ ciudad: "Buenos Aires" }, { ciudad: "Córdoba" }]`.

---

#### Ejercicio R18
**Consigna**: Buscar todos los estudiantes que viven en "Buenos Aires", "Córdoba" o "Rosario".

**💡 Pista**: Usa el operador `$in` con un array de valores: `{ ciudad: { $in: ["Buenos Aires", "Córdoba", "Rosario"] } }`.

---

#### Ejercicio R19
**Consigna**: Buscar todos los estudiantes que NO viven en "Buenos Aires".

**💡 Pista**: Usa el operador `$ne` (not equal) en el campo `ciudad`.

---

#### Ejercicio R20
**Consigna**: Buscar todas las materias que tienen 6 créditos O 8 créditos.

**💡 Pista**: Usa el operador `$in` con un array de valores numéricos: `{ creditos: { $in: [6, 8] } }`.

---

### READ con Proyección (Seleccionar Campos)

#### Ejercicio R21
**Consigna**: Ver solo el nombre y el email de todos los estudiantes (sin mostrar el `_id`).

**💡 Pista**: Usa `find()` con dos parámetros:
- Primer parámetro: `{}` (sin filtro)
- Segundo parámetro: `{ nombre: 1, email: 1, _id: 0 }` (proyección: 1 = incluir, 0 = excluir)

---

#### Ejercicio R22
**Consigna**: Ver solo el nombre y el código de todas las materias (sin mostrar el `_id`).

**💡 Pista**: Similar al ejercicio anterior, pero en la colección `materias` y con los campos `nombre` y `codigo`.

---

#### Ejercicio R23
**Consigna**: Ver todos los campos de los estudiantes EXCEPTO el campo `edad`.

**💡 Pista**: Usa proyección con `0` para excluir: `{ edad: 0 }`. Nota: `_id` se incluirá por defecto.

---

#### Ejercicio R24
**Consigna**: Ver solo el nombre, apellido y ciudad de los estudiantes que están activos (sin mostrar el `_id`).

**💡 Pista**: Combina un filtro en el primer parámetro y proyección en el segundo parámetro.

---

### READ con Ordenamiento y Límites

#### Ejercicio R25
**Consigna**: Ver todos los estudiantes ordenados por edad de menor a mayor (ascendente).

**💡 Pista**: Usa `.sort({ edad: 1 })` después de `find()`. El `1` significa ascendente.

---

#### Ejercicio R26
**Consigna**: Ver todos los estudiantes ordenados por edad de mayor a menor (descendente).

**💡 Pista**: Usa `.sort({ edad: -1 })`. El `-1` significa descendente.

---

#### Ejercicio R27
**Consigna**: Ver todas las materias ordenadas por créditos de mayor a menor.

**💡 Pista**: Similar al ejercicio anterior, pero en la colección `materias` y ordenando por `creditos`.

---

#### Ejercicio R28
**Consigna**: Ver los 3 estudiantes más jóvenes (ordenados por edad ascendente y limitados a 3).

**💡 Pista**: Combina `.sort({ edad: 1 })` con `.limit(3)`.

---

#### Ejercicio R29
**Consigna**: Ver las 2 materias con más créditos (ordenadas por créditos descendente y limitadas a 2).

**💡 Pista**: Similar al ejercicio anterior, pero en la colección `materias` y ordenando por `creditos` descendente.

---

#### Ejercicio R30
**Consigna**: Ver los estudiantes activos, ordenados por edad de menor a mayor, mostrando solo el nombre, apellido y edad (sin `_id`).

**💡 Pista**: Combina:
- Filtro: `{ activo: true }`
- Proyección: `{ nombre: 1, apellido: 1, edad: 1, _id: 0 }`
- Ordenamiento: `.sort({ edad: 1 })`

---

### UPDATE Avanzado

#### Ejercicio U9
**Consigna**: Agregar un campo "tipo" con valor "avanzado" a todos los estudiantes que tienen más de 24 años.

**💡 Pista**: Usa `updateMany()` con:
- Filtro: `{ edad: { $gt: 24 } }`
- Operador: `$set` para agregar el campo

---

#### Ejercicio U10
**Consigna**: Incrementar los créditos en 1 de todas las materias que tienen menos de 7 créditos.

**💡 Pista**: Usa `updateMany()` con:
- Filtro: `{ creditos: { $lt: 7 } }`
- Operador: `$inc` para incrementar

---

#### Ejercicio U11
**Consigna**: Cambiar la ciudad de todos los estudiantes que viven en "Rosario" a "Santa Fe".

**💡 Pista**: Usa `updateMany()` con:
- Filtro: `{ ciudad: "Rosario" }`
- Operador: `$set` para cambiar el valor del campo

---

### DELETE Avanzado

#### Ejercicio D6
**Consigna**: Eliminar todos los estudiantes que están inactivos Y tienen más de 25 años.

**💡 Pista**: Usa `deleteMany()` con múltiples condiciones en el filtro: `{ activo: false, edad: { $gt: 25 } }`.

---

## 📊 Resumen de Operadores "$" Utilizados

### Operadores de Comparación
- `$gt` - Mayor que (greater than)
- `$gte` - Mayor o igual que (greater than or equal)
- `$lt` - Menor que (less than)
- `$lte` - Menor o igual que (less than or equal)
- `$eq` - Igual (equal) - generalmente no se usa, se escribe directamente
- `$ne` - No igual (not equal)

### Operadores Lógicos
- `$and` - Y lógico (todas las condiciones deben cumplirse)
- `$or` - O lógico (al menos una condición debe cumplirse)
- `$in` - Está en un array de valores
- `$nin` - No está en un array de valores

### Operadores de Actualización
- `$set` - Establecer un valor (o agregar un campo nuevo)
- `$inc` - Incrementar un valor numérico
- `$unset` - Eliminar un campo
- `$push` - Agregar un elemento a un array
- `$pull` - Eliminar un elemento de un array

### Métodos y Funciones
- `insertOne()` - Insertar un documento
- `insertMany()` - Insertar múltiples documentos
- `find()` - Buscar documentos (devuelve cursor)
- `findOne()` - Buscar un documento (devuelve un documento)
- `countDocuments()` - Contar documentos
- `updateOne()` - Actualizar un documento
- `updateMany()` - Actualizar múltiples documentos
- `deleteOne()` - Eliminar un documento
- `deleteMany()` - Eliminar múltiples documentos
- `.pretty()` - Formatear la salida para mejor legibilidad
- `.sort()` - Ordenar resultados (1 = ascendente, -1 = descendente)
- `.limit()` - Limitar cantidad de resultados

---

## ✅ Checklist de Verificación

Al finalizar estos ejercicios, deberías poder:

- [ ] Insertar documentos individuales y múltiples
- [ ] Consultar documentos con y sin filtros
- [ ] Contar documentos en una colección
- [ ] Usar operadores de comparación ($gt, $lt, $gte, $lte, $ne)
- [ ] Actualizar documentos individuales y múltiples
- [ ] Usar operadores de actualización ($set, $inc)
- [ ] Eliminar documentos individuales y múltiples
- [ ] Usar operadores lógicos ($and, $or, $in)
- [ ] Seleccionar campos específicos (proyección)
- [ ] Ordenar resultados (sort)
- [ ] Limitar cantidad de resultados (limit)

---

## 💡 Consejos

1. **Siempre usa `$set` en updates**: Si no usas `$set`, reemplazarás todo el documento.
2. **Diferencia entre `find()` y `findOne()`**: `find()` devuelve un cursor (múltiples resultados), `findOne()` devuelve un documento único.
3. **Usa `.pretty()` para leer mejor**: Los resultados son más legibles con formato.
4. **Proyección**: `1` para incluir, `0` para excluir. No mezcles ambos (excepto con `_id`).
5. **Ordenamiento**: `1` = ascendente, `-1` = descendente.
6. **Operadores anidados**: Los operadores van dentro de objetos, por ejemplo: `{ edad: { $gt: 20 } }`.

---

## 📚 Recursos Adicionales

- **Soluciones completas**: Consulta `Clase-1-Ejercicios-Practicos.md`
- **Material completo**: Consulta `Clase-1-Introduccion-MongoDB.md`
- **Documentación oficial**: [https://docs.mongodb.com/](https://docs.mongodb.com/)
