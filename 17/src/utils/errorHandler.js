// Los utils -> Codigo generico, que no dependen de ningun servicio del sistema
// Se podrian utilizar en diferentes lugares
// Es comun que en utils tengas, calculadoras, etc.

export const handleError = (error, res) => {
     const statusCode = error.statusCode || 500
     const message = error.message || "Internal server error"

        res.status(statusCode).json({
        message: message,
        })
}