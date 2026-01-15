// Variables
let nombre: string = "javier"
let edad: number = 33
let esActivo: boolean = true
let cualquiera: any = true
cualquiera = 20
cualquiera = "str"

// tipado mixto
let logic: boolean | null | undefined = false
let fecha: Date = new Date()

// Array -> generalmente manejan un solo tipo
let lenguajes: string[] = ["Javascript", "python", "golang"]
let nums: number[] = [1, 2, 3, 4, 5]
let mixto: (string | number)[] = ["uno", 2, 3]
let masMixto: any[] = [false, true, null, undefined, fecha, "str"]

// funciones
function saludar(nombre:string, apellido: string): string {
    return `Hola ${nombre}, ${apellido}`
}

console.log(saludar("pepe", "garcia"))

// retorno con void, toda funcion que no tenga retorno usara void
function saludar2(nombre:string, apellido: string): void {
    console.log(`Hola ${nombre}, ${apellido}`)
}

// Tipar objetos
// Inline - directo
// Pro: facil // Contra: no es practico porque debemor repetir codigo para cada "instancia"
let auto : {
    marca: string,
    modelo: string
} = {
    marca: "volkswagen",
    modelo: "gol"
}

let auto2 : {
    marca: string,
    model: string
} = {
    marca: "volkswagen",
    model: "bora"
}

// Type -> orientado a objetos literales
// Pro: es simple y se usa para tipar objetos // Contra es que se suele usar para casos muy simples

type Vehiculo = {
    marca: string;
    modelo: string;
    año: number;
}

let ducato: Vehiculo = {
    marca: "fiat",
    modelo: "ducato",
    año: 2006,
}

// Interface - Es un contrato, un acuerdo de como algo debe ser y se debe cumplir
// Molde que garantiza que cualquier objeto o clase que se implemente con la interface cumpla con la forma definida
// de esta forma se suelen tipar las props de los componentes de react
// en js en react se tipan las props prop-types
// los metodos no son implementados en las interfaces, solo van tipados y con su nombre
// Pueden existir propiedades, metodos, parametros opcionales, solo se añade "?"
interface Persona {
    nombre: string;
    edad: number;
    hobbie?: string;
    saludar(nombre?: string): string;
}

let javier : Persona = {
    nombre: "javier",
    edad: 33,
    saludar: (nombre: string): string => {
        return `Hola ${nombre}`
    },
}
console.log(javier.saludar("javier"))
// This solo esta disponible al utilizar function
let matias: Persona = {
    nombre: "matias",
    edad: 22,
    saludar: function(): string {
        return `Adios ${this.nombre}`
    }
}

console.log(matias.saludar())
