// Util -> Herramienta genérica que no depende de ningún servicio específico

export const handleError = (error, res) => {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal server error'

    res.status(statusCode).json({ message })
}
