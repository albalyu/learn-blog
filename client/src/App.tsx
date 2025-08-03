import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AppNavbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailsPage from './pages/PostDetailsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <AppNavbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/posts/:id" element={<PostDetailsPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
