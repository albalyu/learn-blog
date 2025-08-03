import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AppNavbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailsPage from './pages/PostDetailsPage';
import ProfilePage from './pages/ProfilePage';
import EditPostPage from './pages/EditPostPage';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

function App() {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: { id: number } = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (error) {
        console.error("Failed to decode token", error);
        setCurrentUserId(null);
      }
    } else {
      setCurrentUserId(null);
    }

    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      if (newToken) {
        try {
          const decoded: { id: number } = jwtDecode(newToken);
          setCurrentUserId(decoded.id);
        } catch (error) {
          console.error("Failed to decode token", error);
          setCurrentUserId(null);
        }
      } else {
        setCurrentUserId(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <AppNavbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<HomePage currentUserId={currentUserId} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/posts/:id" element={<PostDetailsPage currentUserId={currentUserId} />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
