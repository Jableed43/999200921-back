# Resumen - Pilares de POO en TypeScript

## 4 Pilares de POO

---

## 1. Abstracción

**Definición:** Ocultar la complejidad mostrando solo lo necesario. Separar las características esenciales de un objeto para formar conceptos generales, dejando de lado los detalles particulares.

**Características:**
- Se enfoca en **qué hace** pero no en **cómo lo hace**
- Define estructura pero sin implementación completa
- Permite trabajar con conceptos generales sin preocuparse por detalles internos

### Ejemplo del Mouse:
- **Complejidad oculta:** Circuitos, componentes electrónicos, señales eléctricas
- **Lo necesario para utilizar:** Botones, interfaz física, pila, rueda de scroll, sensor

### Implementación en TypeScript:

#### Interfaces
- Definen **contratos sin implementación**
- Múltiples clases pueden implementar la misma interface
- Garantizan que las clases cumplan con ciertos métodos
- **No se instancian** (no se puede hacer `new Interface()`)

```typescript
interface Vehiculo {
    conducir(): void;
}

class Auto implements Vehiculo {
    conducir(): void {
        console.log("Conduce por carretera");
    }
}
```

---

## 2. Encapsulación

**Definición:** Proteger datos de accesos no autorizados. Controlar cómo se accede y cómo se modifica la información de un objeto, ocultando detalles de la implementación. Relacionado al funcionamiento interno.

### Ejemplo del Mouse:
- **Tornillos:** Protegen el acceso al interior
- **Faja de garantía:** Indica que no debe ser modificado

### Modificadores de Acceso

Palabras reservadas que definen el tipo de acceso a propiedades y métodos:

#### Public
- **Accesible desde cualquier lugar**
- Permite lectura y escritura directa de sus propiedades
- No requiere palabra clave explícita (podemos omitir la palabra `public`)

```typescript
class Planeta {
    public nombre: string;  // Equivalente a: nombre: string;
}
```

#### Private
- **Solo accede desde dentro de la clase** (padre)
- Oculta detalles de la implementación
- Por convención se utiliza `_` delante de la propiedad: `_nombre`
- Tanto `private` como `protected` no se pueden leer ni modificar desde afuera sin ayuda de métodos

```typescript
class Planeta {
    private _masaKg: number;  // Convención con _
}
```

#### Protected
- **Se puede acceder desde la clase y las clases hijas**
- Útil para la herencia
- Permite que las clases derivadas accedan pero no desde fuera

```typescript
class CuerpoCeleste {
    protected radioKm: number;  // Accesible en clases hijas
}
```

### Getters y Setters

#### Getters
- **Traer, obtener, leer, recuperar** un valor
- Se accede como propiedad pero ejecuta código
- Sintaxis: `get nombrePropiedad()`

#### Setters
- **Definir, configurar, asignar** un valor
- Permite validación antes de asignar
- Sintaxis: `set nombrePropiedad(valor)`

### Ventajas de Getters y Setters:
- **Sintaxis más natural** (parecen propiedades normales)
- **Validación automática** en setters
- **Mantienen la encapsulación**

```typescript
class Planeta {
    private _masaKg: number;
    
    public get masaKg(): number {
        return this._masaKg;
    }
    
    public set masaKg(nuevaMasa: number) {
        if (nuevaMasa <= 0) {
            throw new Error("La masa debe ser mayor a 0");
        }
        this._masaKg = nuevaMasa;
    }
}

let saturno = new Planeta("Saturno", 200000, 500000);
// Getter se usa al acceder a la propiedad que representa
console.log(saturno.masaKg);  // Usa getter
// Setter necesita asignación
saturno.masaKg = 250000;  // Usa setter
```

---

## 3. Herencia

**Definición:** Proceso de transmisión de información (métodos y propiedades) de padres a hijos, determinando características que se combinan para crear algo único en cada individuo, resultando en similitudes pero también en variaciones únicas.

### ¿Qué se puede heredar?
- **Métodos**
- **Propiedades**
- **Constructor** (usando `super()`)
- **Modificadores de acceso**

### Sintaxis en TypeScript:

Para heredar de una clase se usa `extends`:

```typescript
// Clase padre
class CuerpoCeleste {
    public nombre: string;
    private codigo: string;
    
    constructor(nombre: string, codigo: string) {
        this.nombre = nombre;
        this.codigo = codigo;
    }
    
    get getCodigo() {
        return this.codigo;
    }
}

// Clase hija
class Planeta extends CuerpoCeleste {
    esHabitable: boolean;
    cantLunas: number;
    
    constructor(nombre: string, codigo: string, esHabitable: boolean, cantLunas: number) {
        // super -> superclase (se refiere a la clase padre)
        // toma los datos del constructor para asignarlos a las variables internas heredadas
        super(nombre, codigo);
        this.esHabitable = esHabitable;
        this.cantLunas = cantLunas;
    }
}

let tierra = new Planeta("Tierra", "T03", true, 1);
tierra.getCodigo;  // Método getter de la clase padre
```

### Palabra clave `super`:
- Se refiere a la **superclase** (clase padre)
- Se usa para llamar al constructor padre: `super(...)`
- Toma los datos del constructor para asignarlos a las variables internas heredadas

---

## 4. Polimorfismo

**Definición:** Utilización de la misma información para crear diferentes clases. Mismo método pero diferentes comportamientos.

### A. Polimorfismo con Interfaces (`implements`)

- Las interfaces **no poseen implementación**
- Definen el **contrato** que deben cumplir las clases
- Múltiples clases pueden implementar la misma interface
- Cada clase implementa el método según sus necesidades
- **Clase vs interface:** interface no se instancia

```typescript
// Interface -> contrato
interface Vehiculo {
    conducir(): void;
}

// Como aplicamos la interface en una clase
class Auto implements Vehiculo {
    conducir() {
        console.log("Conduce por carretera");
    }
}

class Avion implements Vehiculo {
    conducir(): void {
        console.log("Conduce por aire");
    }
}

class Barco implements Vehiculo {
    conducir(): void {
        console.log("Conduce por agua");
    }
}
```

### B. Polimorfismo con Clases (`extends`) - Override

- **Sobreescritura de métodos**
- Se hace por override (sobreescritura) porque la clase padre sí tiene el método implementado
- La clase hija redefine el método con el mismo nombre

```typescript
class Animal {
    hacerSonido(): void {
        console.log("hace un sonido");
    }
}

class Perro extends Animal {
    hacerSonido(): void {
        console.log("Guau guau");
    }
}

class Gato extends Animal {
    hacerSonido(): void {
        console.log("Miau miau");
    }
}
```

---

## 5. Composición (EXTRA)

**Definición:** De varias clases/interfaces/types creamos una más compleja. Un objeto está compuesto por otros objetos. Permite construcción de objetos complejos a partir de objetos más simples, promueve la reutilización y diseño modular.

### Características:
- Un objeto contiene instancias de otros objetos
- Relación "tiene un" (has-a) vs herencia que es "es un" (is-a)
- Permite mayor flexibilidad que la herencia
- Facilita el diseño modular

### Ejemplo:

De varias clases/interfaces/types creamos una más compleja. Un objeto está compuesto por otros objetos.

```typescript
type Continente = "Oceania" | "Asia" | "America" | "Africa" | "Europa";

class Nacionalidad {
    cantHabitantes: number;
    codPais: string;
    continente: Continente;
    nombre: string;
    
    constructor(cantHabitantes: number, codPais: string, continente: Continente, nombre: string) {
        this.cantHabitantes = cantHabitantes;
        this.codPais = codPais;
        this.continente = continente;
        this.nombre = nombre;
    }
}

let alemania = new Nacionalidad(10000, "GER", "Europa", "Alemania");

class Marca {
    nombre: string;
    nacionalidad: Nacionalidad;  // Composición: Marca tiene una Nacionalidad
    
    constructor(nombre: string, nacionalidad: Nacionalidad) {
        this.nombre = nombre;
        this.nacionalidad = nacionalidad;
    }
}

let bmw = new Marca("BMW", alemania);

type Color = "Rojo" | "Verde" | "Negro";

class Auto {
    marca: Marca;  // Composición: Auto tiene una Marca
    color: Color;
    modelo: string;
    
    constructor(marca: Marca, color: Color, modelo: string) {
        this.marca = marca;
        this.color = color;
        this.modelo = modelo;
    }
}

let e30 = new Auto(bmw, "Negro", "E30");
```

### Ventajas de la Composición:
- Permite construcción de objetos complejos a partir de objetos más simples
- Promueve la **reutilización** y diseño modular
- Relación "tiene un" (has-a) vs herencia que es "es un" (is-a)

---

## Resumen de Conceptos Clave

| Concepto | Propósito | Palabra Clave |
|----------|-----------|---------------|
| **Abstracción** | Ocultar complejidad, mostrar lo esencial | `interface` |
| **Encapsulación** | Proteger datos, controlar acceso | `private`, `protected`, `public` |
| **Herencia** | Reutilizar código de clases padre | `extends`, `super()` |
| **Polimorfismo** | Mismo método, diferentes comportamientos | `implements`, override |
| **Composición** | Construir objetos complejos con objetos simples | Objetos como propiedades |

---

## Conceptos Importantes

### Encapsulación:
- Tanto `private` como `protected` no se pueden leer ni modificar desde afuera sin ayuda de métodos
- Los métodos públicos pueden modificar o leer lo protegido y lo privado
- El setter siempre necesita parámetros y no tiene retorno porque su resultado es la asignación de la propiedad interna

### Herencia:
- El constructor de la clase hija toma los datos de la instancia para asignarlos a las variables internas
- `super()` toma los datos del constructor para asignarlos a las variables internas heredadas

### Polimorfismo:
- **Con interfaces:** Las interfaces no se instancian, definen contratos
- **Con clases:** Se hace por override (sobreescritura) porque la clase padre sí tiene el método implementado

---

¡Éxitos aprendiendo POO! 🚀

