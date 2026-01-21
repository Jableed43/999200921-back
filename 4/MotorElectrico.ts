import { Motor } from "./interfaces";
import { TipoCombustible } from "./partes";

export class MotorElectrico implements Motor{
    public estaEncendido: boolean = false;
    public tipoCombustible: TipoCombustible;
    public porcentajeBateria: number = 100;

    constructor(tipoCombustible: TipoCombustible){
        this.tipoCombustible = tipoCombustible
    }

    // Implementar los metodos

    arrancar(): void {
        if(this.estaEncendido === true){
            console.log("El motor electrico ya se encuentra encendido")
        } else {
            if(this.porcentajeBateria > 0){
                this.estaEncendido = true
                console.log("El motor electrico se ha encendido")
            } else {
                console.log("No hay suficiente bateria, porfavor cargar el vehiculo")
            }
        }
    }

    apagar(): void {
        if(this.estaEncendido === false){
            console.log("El motor electrico ya se encuentra apagado")
        } else {
            this.estaEncendido = false
            console.log("El motor electrico se ha apagado")
        }
    }
}