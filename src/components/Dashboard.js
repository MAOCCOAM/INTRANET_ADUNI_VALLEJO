import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import UploadPanel from './UploadPanel';
import LeaderboardTable from './LeaderboardTable';
import { STUDENT_MODALITIES } from '../utils/constants';
import './Dashboard.css';

// --- al inicio del archivo, justo debajo de los imports ---
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";


function Dashboard() {
  // --- Estados Generales ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- Estados para la Vista de Estudiante ---
  const [leaderboardData, setLeaderboardData] = useState({});
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // 1. Obtener datos del usuario
        const userResponse = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUser = userResponse.data;
        setUser(currentUser);

        // 2. Si es estudiante, obtener sus tablas de posiciones
        if (currentUser.role.name === 'student') {
          const lbResponse = await axios.get(`${API_URL}/leaderboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLeaderboardData(lbResponse.data);
          // Seleccionar el primer examen por defecto
          const examNames = Object.keys(lbResponse.data);
          if (examNames.length > 0) {
            setSelectedExam(examNames[0]);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los datos');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/login')} className="error-button">
          Volver al Login
        </button>
      </div>
    );
  }

  // --- Lógica de Renderizado ---
  const isAdmin = user && user.role.name === 'admin';
  const canRegister = user && (user.role.name === 'admin' || user.role.name === 'matriculador');
  const isStudent = user && user.role.name === 'student';
  const examNames = Object.keys(leaderboardData);

  // Función para obtener el icono según el rol
  const getRoleIcon = (roleName) => {
    switch (roleName) {
      case 'admin': return '';
      case 'student': return '';
      case 'teacher': return '';
      case 'matriculador': return '';
      default: return '👤';
    }
  };

  // Función para obtener el color según el rol
  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'admin': return 'role-admin';
      case 'student': return 'role-student';
      case 'teacher': return 'role-teacher';
      case 'matriculador': return 'role-matriculador';
      default: return 'role-default';
    }
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Aduni Vallejo</h1>
            {user && (
              <div className="user-info">
                <span className="user-icon">{getRoleIcon(user.role.name)}</span>
                <div className="user-details">
                  <span className={`user-role ${getRoleColor(user.role.name)}`}>
                    {user.role.name}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-main">
        
        {/* --- VISTA DE ESTUDIANTE --- */}
        {isStudent && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                Resultado de Simulacros
              </h2>
            </div>

            {examNames.length > 0 ? (
              <div className="student-content">
                <div className="exam-selector">
                  <label htmlFor="exam-select" className="selector-label">
                    Selecciona:
                  </label>
                  <select 
                    id="exam-select" 
                    value={selectedExam} 
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="exam-select"
                  >
                    {examNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <LeaderboardTable examName={selectedExam} entries={leaderboardData[selectedExam]} />
              </div>
            ) : (
              <div className="empty-state">
                <p>Aún no se han cargado resultados para tu modalidad.</p>
              </div>
            )}
          </section>
        )}

        {/* --- VISTA DE ADMINISTRADOR --- */}
        {isAdmin && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                Paneles de Carga de Simulacros
              </h2>
              <p className="section-description">
                Sube los resultados de simulacros para cada modalidad
              </p>
            </div>

            <div className="upload-panels-grid">
              {STUDENT_MODALITIES.map(modality => (
                <UploadPanel key={modality} modality={modality} />
              ))}
            </div>
          </section>
        )}

        {/* --- VISTA DE MATRICULADOR / ADMIN --- */}
        {canRegister && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                Registro de Usuarios
              </h2>
              <p className="section-description">
                Crear nuevos usuarios en el sistema
              </p>
            </div>
            <RegistrationForm />
          </section>
        )}

        {/* Mensaje si no hay contenido que mostrar */}
        {!isStudent && !isAdmin && !canRegister && (
          <div className="no-access">
            <h3>Sin permisos adicionales</h3>
            <p>Tu rol actual no tiene acceso a funciones adicionales en el dashboard.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;