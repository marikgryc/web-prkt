import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UserProfile from './pages/UserProfile';
import HomePage from './pages/HomePage';

const Navbar = () => (
  <nav style={{ padding: 20, background: '#000', borderBottom: '1px solid #333' }}>
    <Link to="/" style={{ color: 'white', marginRight: 20 }}>Home</Link>
    <Link to="/profile" style={{ color: 'white' }}>Profile</Link>
  </nav>
);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/profile" element={<UserProfile />} /> */}
      </Routes>
    </BrowserRouter>
  );  
}

export default App;