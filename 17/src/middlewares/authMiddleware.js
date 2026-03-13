// Verificar si el usuario esta autenticado
// si no esta autenticado lo redirige al login
export const isAuthenticated = (req, res, next) => {
    if(req.session && req.session.userId) {
        return next()
    }
    req.session.message = "Debes iniciar sesion para acceder a esta seccion"
    res.redirect("/user/login")
}

export const isGuest = (req, res, next) => {
    if(!req.session || !req.session.userId) {
        return next()
    }
   
    res.redirect("/")
}

