// ## 🏗️ Ejercicio 4: Clases Básicas

import type ejercicio2 = require("./ejercicio2");

// Crea un archivo llamado `ejercicio4.ts` y realiza lo siguiente:

// 1. Crea una clase `Libro` con:
//    - **Propiedades:**
//      - `titulo`: string
//      - `autor`: string
//      - `anio`: number
//      - `disponible`: boolean
   
//    - **Constructor:** que inicialice todas las propiedades
   class Libro {
    titulo: string;
    autor: string;
    anio: number;
    disponible: boolean;

    constructor(titulo: string, autor: string, anio: number, disponible: boolean){
        this.titulo = titulo;
        this.autor = autor;
        this.anio = anio;
        this.disponible = disponible;
    }
   }

   let lordOfTheRings = new Libro("Las dos torres", "j.r.r. tolkien", 1954, true)
   console.log(lordOfTheRings)