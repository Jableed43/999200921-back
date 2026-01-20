# Tarea - Pilares de POO en TypeScript

## Objetivo

Aplicar los conceptos de **Encapsulación**, **Herencia**, **Polimorfismo** y **Composición** aprendidos en clase mediante la creación de un sistema de gestión musical.

---

## Ejercicio 1: Encapsulación y Getters/Setters

Crea una clase `Cancion` con las siguientes características:

### Requisitos:

1. **Propiedades:**
   - `titulo` (public): título de la canción
   - `_duracion` (private): duración en segundos (debe ser mayor a 0)
   - `genero` (protected): género musical

2. **Constructor:**
   - Recibe: `titulo`, `duracion`, `genero`

3. **Getters y Setters:**
   - `get duracion()`: retorna la duración
   - `set duracion(nuevaDuracion)`: valida que sea mayor a 0, si no lanza error con mensaje "La duración debe ser mayor a 0"

### Ejemplo de uso esperado:

```typescript
let cancion1 = new Cancion("Bohemian Rhapsody", 355, "Rock");
console.log(cancion1.titulo);        // "Bohemian Rhapsody"
console.log(cancion1.duracion);      // 355
cancion1.duracion = 400;             // ✅ Funciona
// cancion1.duracion = -10;          // ❌ Error: "La duración debe ser mayor a 0"
```

---

## Ejercicio 2: Herencia

Crea un sistema de herencia para diferentes tipos de artistas musicales:

### Clase Base: `Artista`

**Propiedades:**
- `nombre` (public): nombre del artista
- `codigo` (private): código único del artista

**Constructor:**
- Recibe: `nombre`, `codigo`

**Método:**
- `get getCodigo()`: retorna el código (getter)

### Clase Hija: `Banda` extends `Artista`

**Propiedades adicionales:**
- `activa` (public): boolean indicando si está activa
- `integrantes` (public): número de integrantes

**Constructor:**
- Recibe: `nombre`, `codigo`, `activa`, `integrantes`
- Usa `super()` para inicializar la clase padre

### Ejemplo de uso esperado:

```typescript
let artista1 = new Artista("The Beatles", "ART001");
console.log(artista1.nombre);        // "The Beatles"
artista1.getCodigo;                 // Muestra "ART001"

let banda1 = new Banda("Queen", "BAN001", false, 4);
console.log(banda1.nombre);         // "Queen"
console.log(banda1.activa);         // false
console.log(banda1.integrantes);     // 4
banda1.getCodigo;                   // Muestra "BAN001" (heredado de Artista)
```

---

## Ejercicio 3: Polimorfismo

### Parte A: Polimorfismo con Interfaces

Crea una interface `Reproducible` con el método:
- `reproducir(): void`

Crea tres clases que implementen esta interface:
- `Cancion`: muestra mensaje "Reproduciendo canción"
- `Album`: muestra mensaje "Reproduciendo álbum"
- `Playlist`: muestra mensaje "Reproduciendo playlist"

### Parte B: Polimorfismo con Clases

Crea una clase base `Instrumento` con el método:
- `tocar(): void` que muestra "toca un sonido"

Crea dos clases hijas que extiendan `Instrumento`:
- `Guitarra`: override `tocar()` para mostrar "Toca acordes"
- `Piano`: override `tocar()` para mostrar "Toca melodías"

### Ejemplo de uso esperado:

```typescript
// Polimorfismo con interfaces
let cancion = new Cancion("Stairway to Heaven", 482, "Rock");
let album = new Album("Led Zeppelin IV", 1971);
let playlist = new Playlist("Mi Música Favorita");

cancion.reproducir();    // "Reproduciendo canción"
album.reproducir();      // "Reproduciendo álbum"
playlist.reproducir();   // "Reproduciendo playlist"

// Polimorfismo con clases
let guitarra = new Guitarra();
let piano = new Piano();

guitarra.tocar();  // "Toca acordes"
piano.tocar();     // "Toca melodías"
```

---

## Ejercicio 4: Composición

Crea un sistema que demuestre composición:

### Clase `Musico`

**Propiedades:**
- `nombre` (public): nombre del músico
- `nacionalidad` (public): nacionalidad del músico
- `genero` (public): género musical (usa un type: "Rock" | "Pop" | "Jazz" | "Clasica" | "Electronica")

**Constructor:**
- Recibe: `nombre`, `nacionalidad`, `genero`

### Clase `Album`

**Propiedades:**
- `titulo` (public): título del álbum
- `anio` (public): año de lanzamiento
- `musico` (public): instancia de `Musico`

**Constructor:**
- Recibe: `titulo`, `anio`, `musico`

### Clase `CancionCompleta`

**Propiedades:**
- `album` (public): instancia de `Album`
- `titulo` (public): título de la canción
- `duracion` (public): duración en segundos

**Constructor:**
- Recibe: `album`, `titulo`, `duracion`

### Ejemplo de uso esperado:

```typescript
let musico1 = new Musico("The Beatles", "Británica", "Rock");
let album1 = new Album("Abbey Road", 1969, musico1);
let cancion1 = new CancionCompleta(album1, "Come Together", 259);

console.log(cancion1.album.titulo);                    // "Abbey Road"
console.log(cancion1.album.musico.nombre);           // "The Beatles"
console.log(cancion1.album.musico.genero);            // "Rock"
```

---

## Criterios de Evaluación

- **Ejercicio 1:** Encapsulación correcta, getters/setters funcionando, validación
- **Ejercicio 2:** Herencia correcta, uso de `super()`, propiedades adicionales
- **Ejercicio 3:** Interfaces implementadas, polimorfismo funcionando, override correcto
- **Ejercicio 4:** Composición correcta, objetos compuestos funcionando

---

## Formato de Entrega

1. Crea un archivo `tarea.ts` con todas las clases
2. Crea un archivo `test.ts` con ejemplos de uso de todas las clases
3. Asegúrate de que el código compile sin errores (`tsc --noEmit`)

---

## Fecha de Entrega

[Indicar fecha según corresponda]

---

## Preguntas Frecuentes

**P: ¿Puedo agregar más métodos de los solicitados?**  
R: Sí, siempre que no contradigan los requisitos.

**P: ¿Debo usar `#` o `_` para propiedades privadas?**  
R: Puedes usar cualquiera, pero `_` es más común y compatible.

¡Éxitos con la tarea! 🎵🎸🎹🎤
