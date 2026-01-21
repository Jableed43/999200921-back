import { Motor } from "./interfaces";
import { TipoCombustible } from "./partes";

export class MotorDeCombustion implements Motor {
    public estaEncendido: boolean = false;
    public tipoCombustible: TipoCombustible;
    public porcentajeCombustible: number = 100;

    constructor(tipoCombustible: TipoCombustible) {
        this.tipoCombustible = tipoCombustible
    }

    // Implementar los metodos

    arrancar(): void {
        if (this.estaEncendido === true) {
            console.log("El motor de combustion ya se encuentra encendido")
        } else {
            if (this.porcentajeCombustible > 0) {
                this.estaEncendido = true
                console.log("El motor de combustion se ha encendido")
            } else {
                console.log("El motor electrico se ha encendido")
            }
        }
    }

    apagar(): void {
        if (this.estaEncendido === false) {
            console.log("El motor de combustion ya se encuentra apagado")
        } else {
            this.estaEncendido = false
            console.log("El motor de combustion se ha apagado")
        }
    }
}