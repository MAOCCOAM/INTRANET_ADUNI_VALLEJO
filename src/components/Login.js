import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import "./Login.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL; // 👈 ahora usamos la variable de entorno

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-page">
      <div className="wrapper">
        <div className="form-box login">
          <h2>Aduni Vallejo</h2>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="input-box">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Nombre de usuario:</label>
            </div>
            <div className="input-box">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Contraseña:</label>
            </div>
            <button type="submit" className="btn">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
