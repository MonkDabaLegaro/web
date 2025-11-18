import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(username.trim(), password.trim());

      if (result.success) {
        const redirectPath = 
          result.user.userType === 'admin' ? '/admin' : '/cliente';
        navigate(redirectPath);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error de conexión. Verifique que el servidor esté ejecutándose.');
    }
  };

  return (
    <main className="login-container">
      <h2>Sistema de Asistencia Vehicular</h2>
      <p className="login-subtitle">Ingresa tus credenciales para acceder</p>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              width: "200px",
            }}
          >
            Ingresar
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}
      </form>

      <div className="login-help">
        <h4>Credenciales de prueba:</h4>
        <div className="credentials">
          <p><strong>Administrador:</strong> admin / Admin2024!</p>
          <p><strong>Cliente:</strong> cliente / Cliente2024!</p>
        </div>
      </div>
    </main>
  );
}
