import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import HomePage from './pages/HomePage';
// import UserProfile from './pages/UserProfile'; 

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/profile" element={<UserProfile />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;