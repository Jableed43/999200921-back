// Helpers -> Codigo generico, pero dependen de servicios especificos de tu sistema
// Pueden hacer llamados a servicios 

// Al usarlo el shouldExist debe ser true si buscas que exista, y 
// debe ser false si buscas que no exista

export const checkModelExist = async (Model, query, shouldExist, statusCode, errorMessage) => {
    // Buscamos el documento o registro a ver si existe
     const document = await Model.findOne(query)

        // Si deberia existir y no existe
        if(shouldExist && !document){
            const error = new Error(errorMessage)
            error.statusCode = statusCode
            throw error
        }

       // No deberia existir y existe
            if(!shouldExist && document){
                const error = new Error(errorMessage)
                error.statusCode = statusCode
                throw error
            }

    // retornar documento encontrado o null si no lo encuentra
    return document
}