import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import api from '../api';

const AppNavbar: React.FC = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [userId, setUserId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const currentAccessToken = localStorage.getItem('accessToken');
    setAccessToken(currentAccessToken);
    if (currentAccessToken) {
      try {
        const decoded: { id: number } = jwtDecode(currentAccessToken);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Failed to decode token", error);
        setUserId(null);
      }
    } else {
      setUserId(null);
    }

    const handleStorageChange = () => {
      const newAccessToken = localStorage.getItem('accessToken');
      setAccessToken(newAccessToken);
      if (newAccessToken) {
        try {
          const decoded: { id: number } = jwtDecode(newAccessToken);
          setUserId(decoded.id);
        } catch (error) {
          console.error("Failed to decode token", error);
          setUserId(null);
        }
      } else {
        setUserId(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.post('/api/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Logout failed', error);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUserId(null);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>{t('navbar.blog')}</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>{t('navbar.home')}</Nav.Link>
            </LinkContainer>
            {accessToken && (
              <LinkContainer to="/create-post">
                <Nav.Link>{t('navbar.createPost')}</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          <Nav>
            {accessToken ? (
              <>
                <LinkContainer to={`/profile/${userId}`}>
                  <Nav.Link>{t('navbar.myProfile')}</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={handleLogout}>{t('navbar.logout')}</Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>{t('navbar.login')}</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>{t('navbar.register')}</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};


export default AppNavbar;