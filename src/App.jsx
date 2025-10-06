import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserType } from './utils/auth';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Cliente from './pages/Cliente';
import Ingreso from './pages/Ingreso';
import Consulta from './pages/Consulta';
import Reporte from './pages/Reporte';

function App() {
  const DefaultRoute = () => {
    if (!isAuthenticated()) {
      return <Navigate to="/" replace />;
    }
    const userType = getUserType();
    return <Navigate to={userType === 'admin' ? '/admin' : '/cliente'} replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedUserTypes={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente"
          element={
            <ProtectedRoute allowedUserTypes={['cliente']}>
              <Cliente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ingreso"
          element={
            <ProtectedRoute allowedUserTypes={['admin']}>
              <Ingreso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consulta"
          element={
            <ProtectedRoute>
              <Consulta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reporte"
          element={
            <ProtectedRoute allowedUserTypes={['admin']}>
              <Reporte />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<DefaultRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
