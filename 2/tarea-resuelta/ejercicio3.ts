// ## 🔧 Ejercicio 3: Funciones Tipadas

import type ejercicio2 = require("./ejercicio2")

// Crea un archivo llamado `ejercicio3.ts` y realiza lo siguiente:

// 1. Crea una función `saludar` que:
//    - Reciba un parámetro `nombre` de tipo string
//    - Retorne un string con el mensaje: `"Hola, [nombre]"`
//    - Llama a la función con tu nombre y muestra el resultado

    function saludar(nombre: string): string {
        return `Hola ${nombre}`
    }

    console.log(saludar("javier"))

// 2. Crea una función `calcularPromedio` que:
//    - Reciba un array de números `notas: number[]`
//    - Retorne el promedio (suma de todas las notas / cantidad)
//    - Prueba con el array `[7, 8, 9, 6, 8]`

    function calcularPromedio(nums: number[]): number {
        const suma = nums.reduce((total, nota) => total + nota, 0 )
        return suma / nums.length
    }

    console.log(calcularPromedio([7, 8, 9, 6, 8]))

// 3. Crea una función `mostrarEstudiante` que:
//    - Reciba un objeto de tipo `Estudiante` (del ejercicio anterior)
//    - No retorne nada (`void`)
//    - Use `console.log()` para mostrar la información del estudiante
//    - Si tiene email, mostrarlo; si no, mostrar "Sin email"

function mostrarEstudiante(estudiante: ejercicio2.Estudiante): void {
    console.log("activo", estudiante.activo)
    console.log("edad", estudiante.edad)
    console.log("nombre", estudiante.nombre)
    // Cuando una propiedad es opcional es o el tipo definido o undefined
    if(estudiante.email){
        console.log("email", estudiante.email)
    } else {
        console.log("Sin email", estudiante.email)
    }
}

let estudiante1: ejercicio2.Estudiante = {
    nombre: "vicente",
    edad: 24,
    activo: true,
    email: "vicente@gmail.com"
}

let estudiante2: ejercicio2.Estudiante = {
    nombre: "victoria",
    edad: 27,
    activo: false,
}

mostrarEstudiante(estudiante1)
mostrarEstudiante(estudiante2)