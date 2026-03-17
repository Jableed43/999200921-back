import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

export const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const {loginUser, loading, error} = useLogin()

  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser({email, password})
    console.log({result})
    if(result.success){
      navigate("/productos")
    }
  };



  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input 
              type="password" 
              placeholder="********" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Ingresar'}
          </button>
        </form>
        
        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};
