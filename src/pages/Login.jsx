import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(username.trim(), password.trim());

    if (result.success) {
      const redirectPath = result.userType === 'admin' ? '/admin' : '/cliente';
      navigate(redirectPath);
    } else {
      setError(result.error);
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

        <button type="submit" className="btn btn-primary">
          Ingresar
        </button>
        {error && <p className="error-msg">{error}</p>}
      </form>

      <div className="login-help">
        <h4>Credenciales de prueba:</h4>
        <div className="credentials">
          <p><strong>Administrador:</strong> admin / 1234</p>
          <p><strong>Cliente:</strong> cliente / 5678</p>
        </div>
      </div>
    </main>
  );
}
