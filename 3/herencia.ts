class CuerpoCeleste {
    public nombre: string;
    private codigo: string;

    constructor(nombre: string, codigo: string){
        this.nombre = nombre;
        this.codigo = codigo;
    }

    get getCodigo(){
        console.log(this.codigo)
        return this.codigo
    }
}

let sol = new CuerpoCeleste("helios", "HE021")
sol.getCodigo

// Herencia
// para heredar de una clase se usa "extends"
class Planeta extends CuerpoCeleste{
    esHabitable: boolean;
    cantLunas: number;

    // Este constructor es el que toma los datos de la instancia para asignarlos a las variables internas
    constructor(nombre: string, codigo: string, esHabitable: boolean, cantLunas: number){
       // super -> superclase (se refiere a la clase padre)
       // toma los datos del constructor para asignarlos a las variables internas heredadas
       super(nombre, codigo)
       this.esHabitable = esHabitable;
       this.cantLunas = cantLunas; 
    }

}

let tierra = new Planeta("tierra", "T03", true, 1)
// metodo getter de la clase padre
tierra.getCodigo
