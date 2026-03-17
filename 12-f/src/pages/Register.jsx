import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: ""
  })
  const [success, setSuccess] = useState(false)
  const {error, loading, register} = useRegister()
  const navigate = useNavigate()

  const handleChange = (e) => {
    console.log({[e.target.name] : e.target.value}, "handleChange")
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register(formData)
    console.log({result})
    if(result.success){
      setSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    }
  };

  //Formulario controlado
  //1. cada input tenga un estado
  //2. debe haber un evento que dispare el cambio
  //3. se puede validar mas facil

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Crear una Cuenta</h2>
        
    {error && <div className='error-banner'>{error}</div> }
    { success && (
      <div className='success-banner'> ¡Registro Exitoso! Redirigiendo a iniciar sesión...</div>
    ) }

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input 
              type="text" 
              name="name"
              placeholder="Tu nombre" 
              required 
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input 
              type="text" 
              name="lastName"
              placeholder="Tu apellido" 
              required 
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              name="email"
              placeholder="correo@ejemplo.com" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input 
              type="password" 
              name="password"
              placeholder="Mínimo 6 chars, 1 Mayuscula, 1 Numero" 
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit" disabled={loading || success}>
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
        
        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};
