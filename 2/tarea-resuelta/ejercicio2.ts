// ## 🎨 Ejercicio 2: Tipado de Objetos

// Crea un archivo llamado `ejercicio2.ts` y realiza lo siguiente:

// 1. Crea un tipo `Estudiante` usando `type` con:
//    - `nombre`: string
//    - `edad`: number
//    - `activo`: boolean
//    - `email?`: string (opcional)

export type Estudiante = {
    nombre: string;
    edad: number;
    activo: boolean;
    email?: string;
}

// Como heredar de type a type
type Graduado = Estudiante & {
    matriculaProfesional: number;
}

let medico : Graduado = {
    nombre: "",
    edad: 0,
    activo: false,
    email: "..",
    matriculaProfesional: 0
}

// 2. Crea al menos 2 objetos usando el tipo `Estudiante`:
//    - Uno con todas las propiedades (incluyendo email)
//    - Otro sin la propiedad opcional

let estudiante1: Estudiante = {
    nombre: "vicente",
    edad: 24,
    activo: true,
    email: "vicente@gmail.com"
}

let estudiante2: Estudiante = {
    nombre: "victoria",
    edad: 27,
    activo: false,
}

// 3. Crea una interface `Materia` con:
//    - `nombre`: string
//    - `codigo`: string
//    - `creditos`: number

interface Materia {
    nombre: string;
    codigo: string;
    creditos: number;
}


// 4. Crea un objeto de tipo `Materia`

const materia1: Materia = {
    nombre: "base de datos",
    codigo: "db00",
    creditos: 200
}

// 5. Muestra todos los objetos con `console.log()`
console.log(estudiante1, estudiante2, materia1)