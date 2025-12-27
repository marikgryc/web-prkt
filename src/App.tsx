import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import ActorPage from './pages/ActorPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
function App() {
  return (
    <BrowserRouter>
      <Navbar /> {}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/actor/:id" element={<ActorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;