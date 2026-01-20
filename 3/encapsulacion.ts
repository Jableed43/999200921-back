// Encapsulacion
// Modificadores de acceso (seguridad)
// Palabras reservadas que definen el tipo de acceso
// tanto private como protected no se pueden ni leer ni modificar desde afuera sin ayuda de los metodos

class Planeta{
    public nombre: string;
    private _masaKg: number;
    protected radioKm: number;

    constructor(nombre: string, _masaKg: number, radioKm: number){
        this.nombre = nombre;
        this._masaKg = _masaKg;
        this.radioKm = radioKm;
    }
    
    // Metodos "normales", pueden modificar o leer lo protegido y lo privado
    // public getMasaKg(){
    //     return this._masaKg
    // }

    // public getRadioKm(){
    //     return this.radioKm
    // }

    public get masaKg(): number{
        console.log(`Desde metodo publico masaKg -> accedemos a la masaKg de ${this.nombre}`)
        return this._masaKg
    }

    // El setter siempre necesita parametros - no tiene retorno porque su resultado es la asignacion de la propiedad interna
    public set masaKg(nuevaMasa: number){
       if(nuevaMasa <= 0){
        throw new Error("La masa debe ser mayor a 0")
       } else {
        this._masaKg = nuevaMasa
       }
    }
}

let saturno = new Planeta("saturno", 200000, 500000)
console.log(saturno.nombre)
// console.log(saturno._masaKg = 0)
// console.log(saturno.radioKm = 10);
// console.log(saturno.getMasaKg())
// console.log(saturno.getRadioKm());

// Getter se usa al acceder a la propiedad que representa
console.log("getter", saturno.masaKg)
// Setter necesita asignacion
console.log("setter", saturno.masaKg = 10)