import { Link } from 'react-router-dom';

export const Login = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com" 
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input 
              type="password" 
              placeholder="********" 
              required
            />
          </div>
          <button type="submit">
            Ingresar
          </button>
        </form>
        
        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};
