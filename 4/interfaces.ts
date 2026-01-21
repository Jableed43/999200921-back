// Interfaces -> contratos, definen metodos y propiedades
// Se deben utilizar en claes que las implementan

import { TipoCombustible } from "./partes";

// Interface motor
interface Motor{
    arrancar(): void;
    apagar(): void;
    estaEncendido: boolean;
    tipoCombustible: TipoCombustible;
}

export { Motor }