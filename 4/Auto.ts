import { Motor } from './interfaces'
import { MotorDeCombustion } from './MotorDeCombustion';
import { MotorElectrico } from './MotorElectrico';
import { Chasis, Rueda, TipoCombustible } from './partes';

export class Auto {
    // Como motor es private no se pueden ejecutar sus metodos en las instancias
    private motor: Motor;
    private chasis: Chasis;
    private ruedas: Rueda;
    public precio: number;
    // Patente sirve de identificador unico como un id
    public patente: string;
    // Se crea en cuanto se instancie (timestamp)
    private fechaAlta: Date = new Date();
    // se va a crear cuando el auto se venda
    private fechaVenta: Date | null = null;
    public marca: string;
    public modelo: string;

    constructor(motor: Motor, chasis: Chasis, ruedas: Rueda, precio: number, patente: string, marca: string, modelo: string) {
        // El motor de combustion no puede ser electrico
        if(motor instanceof MotorDeCombustion && motor.tipoCombustible === TipoCombustible.ELECTRICO){
            throw new Error("Un motor de combustion no puede usar electricidad como combustible.")
        }

        // El motor electrico no puede usar nafta ni diesel
        if(motor instanceof MotorElectrico && motor.tipoCombustible !== TipoCombustible.ELECTRICO){
            throw new Error("Un motor electrico no puede usar nafta o diesel")
        }

        this.motor = motor;
        this.chasis = chasis;
        this.ruedas = ruedas;
        this.precio = precio;
        this.patente = patente;
        this.marca = marca;
        this.modelo = modelo;
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

    public get getFechaAlta(){
        return this.fechaAlta
    }

    public get getFechaVenta(){
        return this.fechaVenta
    }

    public set setFechaVenta(fecha: Date){
        this.fechaVenta = fecha
    }
}
