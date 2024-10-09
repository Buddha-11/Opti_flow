import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
// pages & components
import Home from './pages/Home.js';
import SignupForm from './pages/SignupForm.js';
import LoginForm from './pages/LoginForm.js';
import MyForm from "./pages/Form.js";
import ForgotForm from './pages/ForgotPassword.js'
import AdminSignupForm from './pages/SignupAdmin.js'
import AdminLoginForm from './pages/AdminLogin.js'
import ProfileUpdate from './pages/UpdateProfile.js'
import ProtectedRoute from './components/ProtectedRoute.js'; 
import Logout from './pages/Logout.js';
import Profile from './pages/Profile.js';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
              <div className="pages">
          <Routes>
            {/* Protect the home route */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* Public routes */}
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/sendEmail" element={<MyForm />} />
            <Route path="/forgot_password" element={<ForgotForm />} />
            
            {/* Admin-only protected routes */}
            <Route 
              path="/signup_admin" 
              element={<ProtectedRoute adminOnly={true}><AdminSignupForm /></ProtectedRoute>} 
            />
            <Route 
              path="/login_admin" 
              element={<AdminLoginForm />} 
            />
            <Route 
              path="/update_profile" 
              element={<ProfileUpdate />} 
            />
            <Route 
              path="/logout" 
              element={<Logout/>} 
            />
            <Route 
              path="/profile" 
              element={<Profile/>} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
