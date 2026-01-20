// Clase vs interface -> interface no se instancia
// Interface -> contrato
interface Vehiculo{
    conducir(): void
}

// Como aplicamos la interface en una clase

class Auto implements Vehiculo{
    conducir() {
        console.log("Conduce por carretera")
    }
}

class Avion implements Vehiculo{
    conducir(): void {
        console.log("Conduce por aire");
    }
}

class Barco implements Vehiculo{
    conducir(): void {
        console.log("Conduce por agua")
    }
}

// Polimorfismo con clases
// se hace x override (sobreescritura) porque la clase padre si tiene el metodo implementado
class Animal{
    hacerSonido(): void{
        console.log("hace un sonido")
    }
}

class Perro extends Animal{
    hacerSonido(): void {
        console.log("Guau guau")
    }
}

class Gato extends Animal{
    hacerSonido(): void {
        console.log("Miau miau")
    }
}