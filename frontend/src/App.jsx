import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
      
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
