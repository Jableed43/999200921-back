// Enum -> enumeracion
// Es una forma de definir un listado de valores constantes
// En lugar de usar un string, que es propenso a error, utilizas enum
// Tener opciones limitadas y controladas

enum TipoCombustible {
    ELECTRICO = "Electrico",
    NAFTA = "Nafta",
    DIESEL = "Diesel",
    HIBRIDO = "Hibrido"
}

enum TipoRueda {
    DEPORTIVA = "Deportiva", 
    TODO_TERRENO = "Todo terreno",
    CIUDAD = "Ciudad"
}

class Chasis {
    private color: string;

    constructor(color: string){
        this.color = color;
    }

    public set setColor(color: string){
        console.log(`Color cambiado de ${this.color} a ${color}`)
        this.color = color
    }

    public get getColor(){
        return this.color
    }
}

class Rueda {
    private rodado: number;
    private tipo: TipoRueda;

    constructor(rodado: number, tipo: TipoRueda){
        this.rodado = rodado;
        this.tipo = tipo;
    }

    public get getRodado(){
        return this.rodado
    }

    public set setRodado(rodado: number){
        console.log(`El rodado ha cambiado de ${this.rodado} a ${rodado}`)
        this.rodado = rodado
    }

    public get getTipo(){
        return this.tipo
    }
}

export {TipoCombustible, Chasis, Rueda, TipoRueda}