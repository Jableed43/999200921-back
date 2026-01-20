type Continente = "Oceania" | "Asia" | "America" | "Africa" | "Europa"

class Nacionalidad {
    cantHabitantes: number;
    codPais: string;
    continente: Continente;
    nombre: string;

    constructor(cantHabitantes: number, codPais: string, continente: Continente, nombre: string){
        this.cantHabitantes = cantHabitantes;
        this.codPais = codPais;
        this.continente = continente;
        this.nombre = nombre;
    }
}

let alemania = new Nacionalidad(10000, "GER", "Europa" , "Alemania")

class Marca{
    nombre: string;
    nacionalidad: Nacionalidad;

    constructor(nombre: string, nacionalidad: Nacionalidad){
        this.nombre = nombre;
        this.nacionalidad = nacionalidad;
    }
}

let bmw = new Marca("BMW", alemania)

type Color = "Rojo" | "Verde" | "Negro"

class Auto{
    marca: Marca;
    color: Color;
    modelo: string;

    constructor(marca: Marca, color: Color, modelo: string){
        this.marca = marca;
        this.color = color;
        this.modelo = modelo;
    }
}

let e30 = new Auto(bmw, "Negro", "E30")

console.log(e30)