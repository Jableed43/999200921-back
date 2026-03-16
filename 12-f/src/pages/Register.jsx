import { Link } from 'react-router-dom';

export const Register = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Crear una Cuenta</h2>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input 
              type="text" 
              name="name"
              placeholder="Tu nombre" 
              required 
            />
          </div>
          <div>
            <label>Apellido:</label>
            <input 
              type="text" 
              name="lastName"
              placeholder="Tu apellido" 
              required 
            />
          </div>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              name="email"
              placeholder="correo@ejemplo.com" 
              required 
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input 
              type="password" 
              name="password"
              placeholder="Mínimo 6 chars, 1 Mayuscula, 1 Numero" 
              required 
            />
          </div>
          
          <button type="submit">
            Registrarme
          </button>
        </form>
        
        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};
