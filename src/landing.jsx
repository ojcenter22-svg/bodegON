import React from "react";

export default function Landing({ setAuthMode }) {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-logo">
          <span className="logo-icon-on">
            <span className="logo-text-on">ON</span>
          </span>
          BodegON
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a href="https://www.tiktok.com/@sistemabodegas2025" target="_blank" rel="noreferrer" className="btn-tiktok">
            🎵 TikTok
          </a>
          <button onClick={() => setAuthMode("login")} className="btn-nav-login">
            Iniciar Sesión
          </button>
        </div>
      </nav>

      <header className="landing-hero-container">
        <div className="landing-hero">
          <h1>Toma el control total de tu negocio</h1>
          <p>
            La aplicación inteligente para comerciantes y bodegas. Consulta tus precios en dólares, 
            convierte a bolívares en tiempo real o a pesos colombianos, 
            y gestiona tus fiaos con historiales claros.
          </p>
          <button onClick={() => setAuthMode("register")} className="btn-hero-cta">
            Comenzar Gratis Ahora
          </button>
        </div>
      </header>

      <section className="landing-features">
        <h2>¿Por qué usar BodegON?</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">💵</div>
            <h3>Tasas en Vivo</h3>
            <p>Multiplica tus precios en dólares por la tasa BCV oficial, personalizada o pesos COP al instante.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📦</div>
            <h3>Consulta Rápida</h3>
            <p>Busca, encuentra y cotiza tus productos de manera fluida frente al cliente.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📲</div>
            <h3>Control de Fiaos</h3>
            <p>Lleva el historial exacto de cuentas por cobrar, registra abonos y envía recordatorios.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        © 2026 BodegON. Optimizado para el comercio inteligente.
      </footer>
    </div>
  );
}