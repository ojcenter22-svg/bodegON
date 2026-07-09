import React, { useState, useEffect } from 'react';
import Landing from './landing';
import './style.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('landing');
  const [showWelcome, setShowWelcome] = useState(false); // NUEVO: Estado de bienvenida

  // Estados de Usuario
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(
    () => JSON.parse(localStorage.getItem('registeredUsers')) || []
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();

    if (authMode === 'register') {
      if (registeredUsers.find((u) => u.email === cleanEmail))
        return alert('Usuario ya registrado.');

      const newUser = {
        email: cleanEmail,
        password,
        businessName,
        ownerName,
        phone,
        address,
        trialEndDate: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        isActive: true,
        role: 'user',
      };

      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setAuthMode('app');
      setShowWelcome(true); // Se activa el mensaje al registrarse
    } else {
      const u = registeredUsers.find(
        (u) => u.email === cleanEmail && u.password === password
      );
      if (u) {
        if (!u.isActive)
          return alert('Cuenta suspendida. Contacte al administrador.');
        setCurrentUser(u);
        setBusinessName(u.businessName);
        setIsAuthenticated(true);
        setAuthMode('app');
      } else alert('Datos incorrectos.');
    }
  };

  return (
    <div className="hide-on-print">
      {!isAuthenticated && authMode === 'landing' && (
        <Landing setAuthMode={setAuthMode} />
      )}

      {!isAuthenticated && authMode !== 'landing' && (
        <div className="container" style={{ paddingTop: '20px' }}>
          <div className="card auth-card">
            <button
              onClick={() => setAuthMode('landing')}
              className="btn-back-landing"
            >
              ← Volver
            </button>
            <h2>{authMode === 'login' ? 'Ingresar' : 'Registrar Bodega'}</h2>
            <form onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <>
                  <div className="form-group">
                    <label>Nombre del Negocio:</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Propietario:</label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Dirección:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Correo:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-success"
                style={{ width: '100%', marginTop: '10px' }}
              >
                {authMode === 'login' ? 'Entrar' : 'Registrar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PANTALLA DE BIENVENIDA PROFESIONAL */}
      {isAuthenticated && showWelcome && (
        <div
          className="welcome-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#f8fafc',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}
          >
            <h1 style={{ color: '#2d3748' }}>¡Bienvenido, {businessName}!</h1>
            <p>
              Gracias por unirte a <strong>BodegON</strong>. Tu cuenta ha sido
              activada correctamente.
            </p>
            <div
              style={{
                background: '#edf2f7',
                padding: '15px',
                borderRadius: '8px',
                margin: '20px 0',
              }}
            >
              <p>
                Tienes un periodo de{' '}
                <strong>prueba gratuita de 48 horas</strong> para explorar todas
                nuestras herramientas de gestión.
              </p>
              <p>
                Pasado este tiempo, para continuar disfrutando de todas nuestras
                funciones, por favor contáctanos al WhatsApp de soporte técnico:
              </p>
              <h3 style={{ color: '#3182ce' }}>📲 0424-1468403</h3>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="btn-success"
              style={{ padding: '10px 30px', fontSize: '1rem' }}
            >
              Comenzar a Gestionar
            </button>
          </div>
        </div>
      )}

      {isAuthenticated && !showWelcome && (
        <main className="container">
          <h1>Bienvenido, {businessName}</h1>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setAuthMode('landing');
            }}
          >
            Salir
          </button>
        </main>
      )}
    </div>
  );
}
