import React, { useState } from 'react';
import axios from 'axios';
import { ROLES, STUDENT_MODALITIES, SCHEDULES, INVESTMENT_TYPES } from '../utils/constants';
import './RegistrationForm.css';

function RegistrationForm() {
  // --- Estados del Formulario ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleName: 'student', // Rol por defecto
  });

  const [profileData, setProfileData] = useState({
    // Estudiante
    modality: STUDENT_MODALITIES[0],
    schedule: SCHEDULES[0],
    investment: INVESTMENT_TYPES[0],
    // Docente
    startDate: '',
    employmentStatus: '',
    specialty: '',
    academicDegree: '',
  });

  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);

  // --- Manejadores de Cambios ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Lógica de Envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', content: 'No estás autenticado. Por favor, inicia sesión de nuevo.' });
      setIsLoading(false);
      return;
    }

    // Construir el payload final para la API
    const payload = {
      ...formData,
      profileData: {},
    };

    if (formData.roleName === 'student') {
      payload.profileData = {
        modality: profileData.modality,
        schedule: profileData.schedule,
        investment: profileData.investment,
      };
    } else if (formData.roleName === 'teacher') {
      payload.profileData = {
        startDate: profileData.startDate,
        employmentStatus: profileData.employmentStatus,
        specialty: profileData.specialty,
        academicDegree: profileData.academicDegree,
      };
    }

    try {
      await axios.post('http://localhost:4000/api/users/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', content: `Usuario '${formData.email}' creado exitosamente.` });
      // Limpiar formulario tras éxito
      setFormData({ firstName: '', lastName: '', email: '', password: '', roleName: 'student' });
      setProfileData({
        modality: STUDENT_MODALITIES[0],
        schedule: SCHEDULES[0],
        investment: INVESTMENT_TYPES[0],
        startDate: '',
        employmentStatus: '',
        specialty: '',
        academicDegree: '',
      });
    } catch (err) {
      setMessage({ type: 'error', content: err.response?.data?.error || 'Ocurrió un error al crear el usuario.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Renderizado del Formulario ---
  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        <div className="registration-header">
          <h2>Registrar Nuevo Usuario</h2>
          <p>Complete los datos del nuevo miembro</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {message.content && (
            <div className={`message ${message.type}`}>
              {message.content}
            </div>
          )}

          {/* --- Campos Comunes --- */}
          <div className="form-section">
            <h3 className="section-title">Información Básica</h3>
            
            <div className="input-group">
              <label className="input-label">Rol del Nuevo Usuario</label>
              <select 
                name="roleName" 
                value={formData.roleName} 
                onChange={handleFormChange} 
                className="form-select"
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Nombres</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleFormChange} 
                  className="form-input" 
                  required 
                  placeholder="Ingrese los nombres"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Apellidos</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleFormChange} 
                  className="form-input" 
                  required 
                  placeholder="Ingrese los apellidos"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Correo Electrónico</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleFormChange} 
                className="form-input" 
                required 
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Contraseña Temporal</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleFormChange} 
                className="form-input" 
                required 
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <div className="divider"></div>

          {/* --- Campos Dinámicos para Estudiante --- */}
          {formData.roleName === 'student' && (
            <div className="form-section">
              <h3 className="section-title">Perfil del Estudiante</h3>
              
              <div className="input-group">
                <label className="input-label">Modalidad</label>
                <select 
                  name="modality" 
                  value={profileData.modality} 
                  onChange={handleProfileChange} 
                  className="form-select"
                >
                  {STUDENT_MODALITIES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Horario</label>
                  <select 
                    name="schedule" 
                    value={profileData.schedule} 
                    onChange={handleProfileChange} 
                    className="form-select"
                  >
                    {SCHEDULES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Tipo de Inversión</label>
                  <select 
                    name="investment" 
                    value={profileData.investment} 
                    onChange={handleProfileChange} 
                    className="form-select"
                  >
                    {INVESTMENT_TYPES.map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* --- Campos Dinámicos para Docente --- */}
          {formData.roleName === 'teacher' && (
            <div className="form-section">
              <h3 className="section-title">Perfil del Docente</h3>
              
              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Fecha de Ingreso</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={profileData.startDate} 
                    onChange={handleProfileChange} 
                    className="form-input" 
                    required 
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Condición Laboral</label>
                  <input 
                    type="text" 
                    name="employmentStatus" 
                    value={profileData.employmentStatus} 
                    onChange={handleProfileChange} 
                    className="form-input" 
                    required 
                    placeholder="Ej: Tiempo completo"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Especialidad</label>
                  <input 
                    type="text" 
                    name="specialty" 
                    value={profileData.specialty} 
                    onChange={handleProfileChange} 
                    className="form-input" 
                    required 
                    placeholder="Ej: Matemáticas"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Grado Académico</label>
                  <input 
                    type="text" 
                    name="academicDegree" 
                    value={profileData.academicDegree} 
                    onChange={handleProfileChange} 
                    className="form-input" 
                    required 
                    placeholder="Ej: Licenciado"
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creando Usuario...' : 'Crear Usuario'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;