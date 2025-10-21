import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default function Contacto() {
  return (
    <>
      <Header title="Contacto" />
      <Navigation />

      <main className="main-content">
        <div className="welcome-section">
          <h2>Información de Contacto</h2>
          <p>Estamos aquí para ayudarte. Contáctanos a través de cualquiera de estos medios.</p>
        </div>

        <div className="contact-section">
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon">
                <span className="icon">📧</span>
              </div>
              <h3>Correo Electrónico</h3>
              <p>Para consultas generales y soporte técnico</p>
              <a href="mailto:contacto@asistenciavehicular.cl" className="contact-link">
                contacto@asistenciavehicular.cl
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <span className="icon">📞</span>
              </div>
              <h3>Teléfono</h3>
              <p>Línea de atención al cliente 24/7</p>
              <a href="tel:+56912345678" className="contact-link">
                +56 9 1234 5678
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <span className="icon">📱</span>
              </div>
              <h3>WhatsApp</h3>
              <p>Chat directo para consultas rápidas</p>
              <a href="https://wa.me/56912345678" className="contact-link" target="_blank" rel="noopener noreferrer">
                +56 9 1234 5678
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <span className="icon">🏢</span>
              </div>
              <h3>Oficina Principal</h3>
              <p>Dirección física para atención presencial</p>
              <div className="contact-address">
                Av. Providencia 1234, Oficina 501<br />
                Providencia, Santiago<br />
                Chile
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <span className="icon">⏰</span>
              </div>
              <h3>Horarios de Atención</h3>
              <p>Horarios de oficina para consultas presenciales</p>
              <div className="contact-schedule">
                <strong>Lunes a Viernes:</strong> 8:00 - 18:00 hrs<br />
                <strong>Sábados:</strong> 9:00 - 14:00 hrs<br />
                <strong>Domingos:</strong> Cerrado
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <span className="icon">🚨</span>
              </div>
              <h3>Emergencias</h3>
              <p>Línea de emergencia disponible 24/7</p>
              <a href="tel:+56987654321" className="contact-link emergency">
                +56 9 8765 4321
              </a>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>Información Adicional</h3>
          <div className="info-cards">
            <div className="info-card">
              <h4>¿Cuándo contactarnos?</h4>
              <ul>
                <li>Para reportar un siniestro</li>
                <li>Consultas sobre el estado de tu vehículo</li>
                <li>Dudas sobre cobertura y servicios</li>
                <li>Reclamos y sugerencias</li>
              </ul>
            </div>
            <div className="info-card">
              <h4>Respuesta Garantizada</h4>
              <ul>
                <li>Respuesta por email en máximo 24 horas</li>
                <li>Atención telefónica inmediata</li>
                <li>WhatsApp con respuesta en menos de 1 hora</li>
                <li>Soporte técnico especializado</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

