// 1 - Variables y tipos - typeof
let fruta = "frutilla"
var verdura = "lechuga"
const baya = "berenjena"
const puerto = 3000
let estaActivo = true

console.log("tipo de verdura", typeof verdura)
console.log("tipo de baya", typeof baya)
console.log("tipo de puerto", typeof puerto)
console.log("tipo de estaActivo", typeof estaActivo)

// Arrays
let frutas = [fruta, verdura, baya, puerto, estaActivo]
console.log(frutas)
console.log(frutas.length)
// es zero based
console.log(frutas[0])

// Objetos
console.log({
    fruta: fruta,
    puerto: puerto,
    estaActivo: estaActivo
})
// Esto permite escribir solo el valor y clave toma el mismo nombre que la variable
console.log({
    fruta,
    puerto,
    estaActivo
})

// Funciones
// Momentos de las funciones: Definicion (implementacion), Invocacion (le mencionamos para utilizarla)

// Funcion declarada
// esta tiene parametros, usa function, tiene nombre, tiene retorno, tiene llaves 
// posee hoisting
function calcularArea(largo, ancho) {
    return largo * ancho
}

console.log(calcularArea(7, 6))

// Funcion de expression (funcion asignada)
// la funcion es asignada a una variable, esta variable contiene el resultado de la funcion
// no posee hoisting - no se puede ejecutar antes de su declaracion
const multiplicar = function (a, b) {
    return a * b
}

console.log(multiplicar(7, 7))

// Funciones flecha
// Standard
// No usa la palabra function, no posee hoisting
// Si usas llaves usas return
// Si tenes un solo parametro podrias no usar parentesis
// la funcion flecha no puede acceder al this

const saludarUsuario = (nombre) => {
    return `Hola ${nombre}`
}

console.log(saludarUsuario("Alejandro"))

// Sintaxis concisa // retorno implicito
// no usa function, no usa llaves, no usa return
// no posee hoisting
// Sirve para ahorrar espacio y para calculos sencillos

const restar = (a, b) => a - b

// Funciones - metodos
const usuario = {
    nombre: "javier",
    saludar: function () {
        return `Hola ${this.nombre}`
    }
}

console.log(usuario.saludar())

// Estructuras de control
// Secuenciales selectivas (condicionales)
// Iterativas (repetitivas - bucles)

let temperatura = 20

// Validacion
if (typeof temperatura === "number") {
    if (temperatura >= 25) {
        console.log("Temperatura calida")
    } else if (temperatura < 25 && temperatura > 10) {
        console.log("Temperatura templada")
        // caso fallback
    } else {
        console.log("Temperatura fria")
    }
} else {
    console.log("Ingrese un numero")
}

// If ternario, armar sentencias logicas en poco espacio
let resultado = temperatura >= 25 ? "Temperatura calida" : "Temperatura fria"

let resultado2 = temperatura >= 25 ? "Temperatura calida" : temperatura < 25 && temperatura > 10 ? "Temperatura templada" : "Temperatura fria"

// Switch case
// Cuando en los case tenemos expresiones logicas debemos matchear la expresion con la condicion del switch case
switch (true) {
    case temperatura >= 25:
        console.log("Temperatura calida - switch")
        break;

    case temperatura < 25 && temperatura > 10:
        console.log("Temperatura templada - switch")
        break;
    
    case temperatura < 10:
        console.log("Temperatura fria - switch")
        break;
    // Si no se complio ningun case entonces caemos en el default
    default:
        console.log("Ingrese un numero - switch")
        break;
}

// Operadores de comparacion
let x = "5"
let y = 5

// Comparacion por valor (igualdad de valores)
console.log(x == y)
// Comparacion por valor y tipo (igualdad estricta)
console.log(x === y)

// Desigualdad

// Comparacion por valor (Desigualdad de valores)
console.log(x != y)
// Comparacion por valor y tipo (Desigualdad estricta)
console.log(x !== y)

// Operadores logicos
// planetas
let tieneAtmosfera = false
let temperaturaAdecuada = true
let tieneAgua = false

// AND - && - Solo dara true cuando todos los terminos sean true
if(tieneAtmosfera && temperaturaAdecuada){
    console.log("Es habitable")
} else {
    console.log("No es habitable")
}

if(!tieneAtmosfera || !temperaturaAdecuada){
    console.log("No es habitable")
} else {
    console.log("Es habitable")
}

// OR - || - Solo dara false cuando todos los terminos sean false
if(temperaturaAdecuada || tieneAgua){
    console.log("Es habitable")
} else {
    console.log("No es habitable")
}

// NOT - ! - Niega la condicion
if(!(temperaturaAdecuada || tieneAgua)){
    console.log("No es habitable")
} else {
    console.log("Es habitable")
}
