import React from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import IngresoSiniestroForm from '../components/forms/IngresoSiniestroForm';

const IngresoSiniestro = () => {
  return (
    <div className="app">
      <Header />
      <Navigation activePage="ingreso" />
      <main className="main-content">
        <IngresoSiniestroForm />
      </main>
    </div>
  );
};

export default IngresoSiniestro;