// La clase si puede contener la implementacion de los metodos a diferencia de la interface
// Puedo utilizar una o mas interfaces para tipar mi clase
// La clase es la unica que puede generar instancias

class Planeta {
    // Atributos
    nombre: string;
    masaKg: number;
    radioKm: number;
    tieneAtmosfera: boolean;
    tipo: string;

    // Constructor -> es un metodo que inicializa las propiedades al crear el objeto - instancia
    constructor(name: string, masaKg: number, radioKm: number, tieneAtmosfera: boolean, tipo: string){
        this.nombre = name;
        this.masaKg = masaKg;
        this.radioKm = radioKm;
        this.tieneAtmosfera = tieneAtmosfera;
        this.tipo = tipo;
    }

    // Metodos
}

let tierra = new Planeta("tierra", 200, 200, true, "planeta")
let saturno = new Planeta("saturno", 200, 200, true, "planeta")
console.log(tierra)