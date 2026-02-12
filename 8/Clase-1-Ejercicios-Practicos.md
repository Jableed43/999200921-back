# Ejercicios Prácticos - Clase 1: Introducción a MongoDB

**Base de Datos**: `escuela`  
**Colecciones**: `estudiantes` y `materias`

> **Nota**: Este archivo contiene una selección de ejercicios para la primera clase. Todos los ejercicios adicionales están disponibles en `Clase-1-Introduccion-MongoDB.md` sección 10.1.

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

#### Ejercicio C1: Insertar un estudiante nuevo
```javascript
db.estudiantes.insertOne({
  nombre: "Roberto",
  apellido: "Pérez",
  email: "roberto.perez@example.com",
  edad: 24,
  ciudad: "Mendoza",
  activo: true
});
```

#### Ejercicio C2: Insertar una materia nueva
```javascript
db.materias.insertOne({
  nombre: "Inglés Técnico",
  codigo: "ING501",
  creditos: 4,
  docente: "Prof. Smith"
});
```

#### Ejercicio C3: Insertar múltiples estudiantes
```javascript
db.estudiantes.insertMany([
  { 
    nombre: "Patricia", 
    apellido: "González", 
    email: "patricia.gonzalez@example.com", 
    edad: 23, 
    ciudad: "Córdoba", 
    activo: true 
  },
  { 
    nombre: "Diego", 
    apellido: "Ramírez", 
    email: "diego.ramirez@example.com", 
    edad: 26, 
    ciudad: "Buenos Aires", 
    activo: true 
  }
]);
```

---

### READ - Leer Documentos

#### Ejercicio R1: Ver todos los estudiantes
```javascript
db.estudiantes.find();
```

#### Ejercicio R2: Ver todos los estudiantes con formato legible
```javascript
db.estudiantes.find().pretty();
```

#### Ejercicio R3: Ver todas las materias
```javascript
db.materias.find().pretty();
```

#### Ejercicio R4: Buscar un estudiante por nombre exacto
```javascript
db.estudiantes.findOne({ nombre: "Ana" });
```

#### Ejercicio R5: Buscar una materia por código
```javascript
db.materias.findOne({ codigo: "MAT101" });
```

#### Ejercicio R6: Contar cuántos estudiantes hay
```javascript
db.estudiantes.countDocuments();
```

#### Ejercicio R7: Contar cuántas materias hay
```javascript
db.materias.countDocuments();
```

#### Ejercicio R8: Buscar estudiantes de una ciudad específica
```javascript
db.estudiantes.find({ ciudad: "Buenos Aires" });
```

#### Ejercicio R9: Buscar estudiantes activos
```javascript
db.estudiantes.find({ activo: true });
```

---

### UPDATE - Actualizar Documentos

#### Ejercicio U1: Actualizar la edad de un estudiante
```javascript
db.estudiantes.updateOne(
  { nombre: "Ana" },
  { $set: { edad: 23 } }
);
```

#### Ejercicio U2: Actualizar los créditos de una materia
```javascript
db.materias.updateOne(
  { codigo: "MAT101" },
  { $set: { creditos: 7 } }
);
```

#### Ejercicio U3: Cambiar el docente de una materia
```javascript
db.materias.updateOne(
  { nombre: "Programación" },
  { $set: { docente: "Ing. Rodríguez" } }
);
```

#### Ejercicio U4: Agregar un campo nuevo a un estudiante
```javascript
db.estudiantes.updateOne(
  { nombre: "María" },
  { $set: { telefono: "1234567890" } }
);
```

---

### DELETE - Eliminar Documentos

#### Ejercicio D1: Eliminar un estudiante por nombre
```javascript
db.estudiantes.deleteOne({ nombre: "Roberto" });
```

#### Ejercicio D2: Eliminar una materia por código
```javascript
db.materias.deleteOne({ codigo: "ING501" });
```

---

## 🎯 FASE 2: Operadores de Comparación (Nivel Intermedio)

### READ con Operadores

#### Ejercicio R10: Buscar estudiantes mayores de 22 años
```javascript
db.estudiantes.find({ edad: { $gt: 22 } });
```

#### Ejercicio R11: Buscar estudiantes menores o iguales a 21 años
```javascript
db.estudiantes.find({ edad: { $lte: 21 } });
```

#### Ejercicio R12: Buscar estudiantes entre 20 y 25 años
```javascript
db.estudiantes.find({ edad: { $gte: 20, $lte: 25 } });
```

#### Ejercicio R13: Buscar materias con más de 6 créditos
```javascript
db.materias.find({ creditos: { $gt: 6 } });
```

#### Ejercicio R14: Buscar estudiantes que NO están activos
```javascript
db.estudiantes.find({ activo: { $ne: true } });
// O más simple:
db.estudiantes.find({ activo: false });
```

#### Ejercicio R15: Buscar materias con 6 créditos exactos
```javascript
db.materias.find({ creditos: 6 });
```

---

### UPDATE con Operadores

#### Ejercicio U5: Incrementar la edad de todos los estudiantes en 1 año
```javascript
db.estudiantes.updateMany(
  {},
  { $inc: { edad: 1 } }
);
```

#### Ejercicio U6: Incrementar los créditos de todas las materias en 1
```javascript
db.materias.updateMany(
  {},
  { $inc: { creditos: 1 } }
);
```

#### Ejercicio U7: Activar todos los estudiantes inactivos
```javascript
db.estudiantes.updateMany(
  { activo: false },
  { $set: { activo: true } }
);
```

#### Ejercicio U8: Agregar campo "telefono" a todos los estudiantes de Buenos Aires
```javascript
db.estudiantes.updateMany(
  { ciudad: "Buenos Aires" },
  { $set: { telefono: "011-1234-5678" } }
);
```

#### Ejercicio U9: Eliminar el campo "telefono" de un estudiante
```javascript
db.estudiantes.updateOne(
  { nombre: "María" },
  { $unset: { telefono: "" } }
);
```

#### Ejercicio U10: Crear array y agregar elemento con $push
```javascript
// Paso 1: Crear el array vacío
db.estudiantes.updateOne(
  { nombre: "Juan" },
  { $set: { materiasInscritas: [] } }
);

// Paso 2: Agregar un elemento al array
db.estudiantes.updateOne(
  { nombre: "Juan" },
  { $push: { materiasInscritas: "MAT101" } }
);
```

#### Ejercicio U11: Agregar elemento a un array existente
```javascript
db.estudiantes.updateOne(
  { nombre: "Juan" },
  { $push: { materiasInscritas: "PROG201" } }
);
```

#### Ejercicio U12: Eliminar elemento de un array
```javascript
db.estudiantes.updateOne(
  { nombre: "Juan" },
  { $pull: { materiasInscritas: "MAT101" } }
);
```

---

### DELETE con Operadores

#### Ejercicio D3: Eliminar todos los estudiantes inactivos
```javascript
db.estudiantes.deleteMany({ activo: false });
```

#### Ejercicio D4: Eliminar estudiantes menores de 20 años
```javascript
db.estudiantes.deleteMany({ edad: { $lt: 20 } });
```

#### Ejercicio D5: Eliminar materias con menos de 5 créditos
```javascript
db.materias.deleteMany({ creditos: { $lt: 5 } });
```

---

## 🎯 FASE 3: Operadores Lógicos y Proyección (Nivel Avanzado)

### READ con Operadores Lógicos

#### Ejercicio R16: Buscar estudiantes activos Y mayores de 22 años
```javascript
db.estudiantes.find({
  activo: true,
  edad: { $gt: 22 }
});
```

#### Ejercicio R17: Buscar estudiantes de Buenos Aires O Córdoba
```javascript
db.estudiantes.find({
  $or: [
    { ciudad: "Buenos Aires" },
    { ciudad: "Córdoba" }
  ]
});
```

#### Ejercicio R18: Buscar estudiantes de Buenos Aires, Córdoba o Rosario
```javascript
db.estudiantes.find({
  ciudad: { $in: ["Buenos Aires", "Córdoba", "Rosario"] }
});
```

#### Ejercicio R19: Buscar estudiantes que NO son de Buenos Aires
```javascript
db.estudiantes.find({
  ciudad: { $ne: "Buenos Aires" }
});
```

#### Ejercicio R20: Buscar materias con 6 O 8 créditos
```javascript
db.materias.find({
  creditos: { $in: [6, 8] }
});
```

---

### READ con Proyección (Seleccionar Campos)

#### Ejercicio R21: Ver solo nombre y email de todos los estudiantes
```javascript
db.estudiantes.find({}, { nombre: 1, email: 1, _id: 0 });
```

#### Ejercicio R22: Ver solo nombre y código de todas las materias
```javascript
db.materias.find({}, { nombre: 1, codigo: 1, _id: 0 });
```

#### Ejercicio R23: Ver todos los campos excepto edad
```javascript
db.estudiantes.find({}, { edad: 0 });
```

#### Ejercicio R24: Ver nombre, apellido y ciudad de estudiantes activos
```javascript
db.estudiantes.find(
  { activo: true },
  { nombre: 1, apellido: 1, ciudad: 1, _id: 0 }
);
```

---

### READ con Ordenamiento y Límites

#### Ejercicio R25: Ver estudiantes ordenados por edad (ascendente)
```javascript
db.estudiantes.find().sort({ edad: 1 });
```

#### Ejercicio R26: Ver estudiantes ordenados por edad (descendente)
```javascript
db.estudiantes.find().sort({ edad: -1 });
```

#### Ejercicio R27: Ver materias ordenadas por créditos (descendente)
```javascript
db.materias.find().sort({ creditos: -1 });
```

#### Ejercicio R28: Ver los 3 estudiantes más jóvenes
```javascript
db.estudiantes.find().sort({ edad: 1 }).limit(3);
```

#### Ejercicio R29: Ver las 2 materias con más créditos
```javascript
db.materias.find().sort({ creditos: -1 }).limit(2);
```

#### Ejercicio R30: Ver estudiantes activos, ordenados por edad, mostrando solo nombre, apellido y edad
```javascript
db.estudiantes.find(
  { activo: true },
  { nombre: 1, apellido: 1, edad: 1, _id: 0 }
).sort({ edad: 1 });
```

---

### UPDATE Avanzado

#### Ejercicio U13: Actualizar estudiantes mayores de 24 años, agregándoles un campo "tipo" con valor "avanzado"
```javascript
db.estudiantes.updateMany(
  { edad: { $gt: 24 } },
  { $set: { tipo: "avanzado" } }
);
```

#### Ejercicio U14: Incrementar créditos de materias con menos de 7 créditos
```javascript
db.materias.updateMany(
  { creditos: { $lt: 7 } },
  { $inc: { creditos: 1 } }
);
```

#### Ejercicio U15: Cambiar la ciudad de estudiantes de "Rosario" a "Santa Fe"
```javascript
db.estudiantes.updateMany(
  { ciudad: "Rosario" },
  { $set: { ciudad: "Santa Fe" } }
);
```

#### Ejercicio U16: Eliminar campo "telefono" de todos los estudiantes de Buenos Aires
```javascript
db.estudiantes.updateMany(
  { ciudad: "Buenos Aires" },
  { $unset: { telefono: "" } }
);
```

#### Ejercicio U17: Agregar múltiples elementos a un array usando $push con $each
```javascript
db.estudiantes.updateOne(
  { nombre: "María" },
  { 
    $push: { 
      materiasInscritas: { 
        $each: ["MAT101", "PROG201", "BD301"] 
      } 
    } 
  }
);
```

#### Ejercicio U18: Eliminar múltiples elementos de un array usando $pull con $in
```javascript
db.estudiantes.updateOne(
  { nombre: "María" },
  { 
    $pull: { 
      materiasInscritas: { 
        $in: ["MAT101", "PROG201"] 
      } 
    } 
  }
);
```

---

### DELETE Avanzado

#### Ejercicio D6: Eliminar estudiantes inactivos mayores de 25 años
```javascript
db.estudiantes.deleteMany({
  activo: false,
  edad: { $gt: 25 }
});
```

---

## 📊 Resumen de Ejercicios por Fase

| Fase | Nivel | Operaciones | Cantidad | Conceptos Clave |
|------|-------|-------------|----------|-----------------|
| **FASE 1** | Básico | CRUD completo | 20 ejercicios | insertOne, insertMany, find, findOne, updateOne, deleteOne, countDocuments |
| **FASE 2** | Intermedio | READ, UPDATE, DELETE con operadores | 19 ejercicios | $gt, $lt, $gte, $lte, $eq, $ne, $inc, $set, $unset, $push, $pull, updateMany, deleteMany |
| **FASE 3** | Avanzado | Operadores lógicos, proyección, ordenamiento | 16 ejercicios | $and, $or, $in, proyección (1/0), sort, limit |

**Total**: 55 ejercicios prácticos para la primera clase

---

## 🎓 Guía de Uso para el Docente

### Tiempo Estimado
- **FASE 1 (CRUD Básico)**: 60-75 minutos
- **FASE 2 (Operadores)**: 45-60 minutos
- **FASE 3 (Avanzado)**: 45-60 minutos
- **Total**: 2.5 - 3.25 horas

### Recomendación de Flujo

1. **Primera parte de la clase (teoría)**: Explicar diferencias MySQL vs MongoDB, conceptos básicos
2. **FASE 1**: Realizar todos los ejercicios CRUD básicos (asegurar comprensión fundamental)
3. **FASE 2**: Introducir operadores de comparación con ejercicios prácticos
4. **FASE 3**: Si hay tiempo, avanzar con operadores lógicos y proyección

### Puntos Clave a Enfatizar

- ✅ **CREATE**: MongoDB crea la colección automáticamente al insertar el primer documento
- ✅ **READ**: `find()` devuelve un cursor, `findOne()` devuelve un documento
- ✅ **UPDATE**: Siempre usar `$set` para actualizar campos específicos
- ✅ **DELETE**: `deleteOne()` elimina el primer documento que coincida, `deleteMany()` elimina todos
- ✅ **Operadores**: `$gt`, `$lt`, `$gte`, `$lte` para comparaciones numéricas
- ✅ **Operadores de actualización**: `$set` (establecer), `$inc` (incrementar), `$unset` (eliminar campo), `$push` (agregar a array), `$pull` (eliminar de array)
- ✅ **Proyección**: `1` para incluir, `0` para excluir (no mezclar ambos en la misma consulta)
- ✅ **Ordenamiento**: `1` ascendente, `-1` descendente

### Errores Comunes a Prevenir

1. ❌ Olvidar usar `$set` en updates: `updateOne({...}, {edad: 21})` reemplaza todo el documento
2. ❌ Confundir `find()` con `findOne()`: `find()` devuelve cursor, `findOne()` devuelve documento
3. ❌ No usar `.pretty()`: Los resultados pueden ser difíciles de leer
4. ❌ Olvidar que `_id` se incluye por defecto: Usar `_id: 0` en proyección para excluirlo
5. ❌ Mezclar `1` y `0` en proyección: Debe ser todo `1` o todo `0` (excepto `_id`)

---

## 📚 Ejercicios Adicionales

Para más ejercicios y niveles superiores, consulta:
- `Clase-1-Introduccion-MongoDB.md` - Sección 10.1 (Ejercicios Adicionales por Nivel)
- Incluye ejercicios de Nivel 4 (Muy Avanzado) y Nivel 5 (Experto)

---

## ✅ Checklist de Aprendizaje

Al finalizar estos ejercicios, el estudiante debería poder:

- [ ] Insertar documentos (insertOne, insertMany)
- [ ] Consultar documentos (find, findOne)
- [ ] Contar documentos (countDocuments)
- [ ] Aplicar filtros básicos en consultas
- [ ] Usar operadores de comparación ($gt, $lt, $gte, $lte, $eq, $ne)
- [ ] Actualizar documentos (updateOne, updateMany)
- [ ] Usar operadores de actualización ($set, $inc, $unset, $push, $pull)
- [ ] Eliminar documentos (deleteOne, deleteMany)
- [ ] Usar operadores lógicos ($and, $or, $in)
- [ ] Seleccionar campos específicos (proyección)
- [ ] Ordenar resultados (sort)
- [ ] Limitar cantidad de resultados (limit)
