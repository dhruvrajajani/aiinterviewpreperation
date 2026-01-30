import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CodingArena from './pages/CodingArena';
import ResumeBuilder from './pages/ResumeBuilder';
import MockInterview from './pages/MockInterview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="coding" element={<CodingArena />} />
            <Route path="resume" element={<ResumeBuilder />} />
            <Route path="interview" element={<MockInterview />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
