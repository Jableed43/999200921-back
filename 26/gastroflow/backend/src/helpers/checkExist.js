// Helper -> Función genérica relacionada con lógica de nuestro sistema
//
// checkModelExist(Model, query, shouldExist, statusCode, errorMessage)
//
// shouldExist = true  → queremos que el documento EXISTA (ej: buscar por ID antes de editar)
// shouldExist = false → queremos que NO exista    (ej: validar que el nombre sea único)

export const checkModelExist = async (Model, query, shouldExist, statusCode, errorMessage) => {
    const document = await Model.findOne(query)

    // Debería existir y no existe
    if (shouldExist && !document) {
        const error = new Error(errorMessage)
        error.statusCode = statusCode
        throw error
    }

    // No debería existir y existe
    if (!shouldExist && document) {
        const error = new Error(errorMessage)
        error.statusCode = statusCode
        throw error
    }

    return document
}
