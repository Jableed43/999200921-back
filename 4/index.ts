import { Auto } from "./Auto";
import { Concesionario } from "./Concesionario";
import { MotorDeCombustion } from "./MotorDeCombustion";
import { MotorElectrico } from "./MotorElectrico";
import { Chasis, Rueda, TipoCombustible, TipoRueda } from "./partes";

let fitito = new Auto(new MotorDeCombustion(TipoCombustible.NAFTA), new Chasis("negro"),
 new Rueda(14, TipoRueda.CIUDAD), 4000000, "AAAAAA", "fiat", "600")

 console.log(fitito)

fitito.conducir()
fitito.encender()
fitito.conducir()
fitito.apagar()

let fitito2 = new Auto(new MotorElectrico(TipoCombustible.ELECTRICO), new Chasis("negro"),
 new Rueda(14, TipoRueda.CIUDAD), 4000000, "AAAAAA", "fiat", "600")

 console.log(fitito2)

let titoAutos = new Concesionario()
titoAutos.fabricarAuto(new MotorElectrico(TipoCombustible.ELECTRICO), new Chasis("negro"),
 new Rueda(14, TipoRueda.CIUDAD), 4000000, "AAAAAA", "fiat", "600")

 titoAutos.fabricarAuto(new MotorDeCombustion(TipoCombustible.DIESEL), new Chasis("gris perla"),
  new Rueda(21, TipoRueda.DEPORTIVA), 10000000, "BBBBBB", "volkswagen", "Bora")

titoAutos.fabricarAuto(new MotorElectrico(TipoCombustible.ELECTRICO), new Chasis("rojo"), new Rueda(20, TipoRueda.CIUDAD),
20000000, "CCCCCC", "tesla", "cybertruck")

console.log("------TEST------")
console.log("autos disponibles", titoAutos.getAutosDisponibles)
console.log("autos vendidos",titoAutos.getAutosVendidos)
console.log("cantidad autos", titoAutos.obtenerCantidadAutos())
titoAutos.venderAuto("CCCCCC")
console.log("autos disponibles", titoAutos.getAutosDisponibles)
console.log("autos vendidos",titoAutos.getAutosVendidos)
console.log("cantidad autos", titoAutos.obtenerCantidadAutos())
titoAutos.venderAuto("CCCCCC")