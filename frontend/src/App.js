import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
// pages & components
import Home from './pages/Home.js'
import SignupForm from './pages/SignupForm.js'
import LoginForm from './pages/LoginForm.js'
import MyForm from "./pages/Form.js";
import ForgotForm from './pages/ForgotPassword.js'


function App() {

  return (
    <div className="App">
      <BrowserRouter>
      
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={<Home />} 
            />
            <Route 
              path="/signup" 
              element={<SignupForm />} 
            />
            <Route 
              path="/login" 
              element={<LoginForm />} 
            />
            <Route
             path="/sendEmail" 
             element={<MyForm />} 
             />
              <Route
             path="/forgot_password" 
             element={<ForgotForm />} 
             />
          
            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;