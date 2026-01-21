import { Motor } from './interfaces'
import { Chasis, Rueda } from './partes';

export class Auto {
    private motor: Motor;
    private chasis: Chasis;
    private ruedas: Rueda;
    private precio: number;
    private patente: string;
    // Se crea en cuanto se instancie (timestamp)
    private fechaAlta: Date = new Date();
    // se va a crear cuando el auto se venda
    private fechaVenta: Date | null = null;

    constructor(motor: Motor, chasis: Chasis, ruedas: Rueda, precio: number, patente: string) {
        this.motor = motor;
        this.chasis = chasis;
        this.ruedas = ruedas;
        this.precio = precio;
        this.patente = patente;
    }

    // encender(), apagar(), conducir()
    // Getters/Setters: getPrecio, setPrecio, getFechaAlta, getFechaVenta, setFechaVenta, getPatente, setPatente
    public encender(): void {
        console.log("Encendio el auto, arrancó el motor")
        this.motor.arrancar()
    }

    public apagar(): void {
        console.log("Se apago el auto")
        this.motor.apagar()
    }

    public conducir(): void {
        if (this.motor.estaEncendido) {
            console.log("El auto esta en movimiento")
        } else {
            console.log("Debes encender el auto para poder conducirlo")
        }
    }
}