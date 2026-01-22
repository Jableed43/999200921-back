// Concesionario (Sistema Administrador)

import { Auto } from "./Auto";
import { Motor } from "./interfaces";
import { Chasis, Rueda } from "./partes";

// Propiedades: autosDisponibles[], autosVendidos[]
// Métodos: fabricarAuto(), obtenerCantidadAutos(), venderAuto(patente), getAutosDisponibles, getAutosVendidos

export class Concesionario {
    // Puede ser un array de autos o un array vacio
    private autosDisponibles: Auto[] = []
    private autosVendidos: Auto[] = []

    // Maneja la instanciacion del nuevo auto y guarda el nuevo registro en autosDisponibles
    public fabricarAuto(motor: Motor, chasis: Chasis, ruedas: Rueda, precio: number, patente: string,
        marca: string, modelo: string) {
        const nuevoAuto = new Auto(motor, chasis, ruedas, precio, patente, marca, modelo)

        this.autosDisponibles.push(nuevoAuto)
        console.log("Auto creado y agregado al inventario", nuevoAuto)
        return nuevoAuto
    }

    public obtenerCantidadAutos(): number{
        return this.autosDisponibles.length
    }

    public get getAutosDisponibles(){
        return this.autosDisponibles
    }

    //venderAuto(patente)

    public venderAuto(patente: string): Auto | null{
        // Cual metodo de array usarias para buscar el auto que queres vender?
        // Find -> trae el registro completo -> no te trae el index, por lo tanto no lo podrias sacar del array
        // Map -> similar a find
        // FindIndex -> busca el en el array y trae el indice del registro que coincide con el predicado (condicion)
        // Si no encuentra el registro retorna -1
        let autoEncontrado = this.autosDisponibles.findIndex(auto => auto.patente === patente)

        // El valor del auto encontrado debe ser mayor a -1, porque este es el valor que findIndex retorna cuando no encuentra
        // el registro. 
        if(autoEncontrado > -1){
            // Splice -> Eliminar elementos del array y retorna un nuevo array con los elementos eliminados
            // Parametros, indice desde donde empezar y la cantidad de elementos a eliminar
            // Si bien lo eliminamos de la forma que lo hacemos lo cortamos 
            // ya que autoVendido es un array con el auto "eliminado", con [0] accedemos al objeto
            // IMPORTANTE -> splice si cambia el array original. cambia el contenido del array.
            const autoVendido = this.autosDisponibles.splice(autoEncontrado, 1)[0]

            autoVendido.setFechaVenta = new Date()

            console.log(`Auto con patente ${patente}, fue vendido`)

            this.autosVendidos.push(autoVendido)

            return autoVendido
        }
        console.log("No se encontro el auto")
        return null
    }

    //getAutosVendidos
    public get getAutosVendidos(){
        return this.autosVendidos
    }
}