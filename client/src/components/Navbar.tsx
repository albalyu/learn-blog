import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';

const AppNavbar: React.FC = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    setToken(currentToken);
    if (currentToken) {
      const decoded: { id: number } = jwtDecode(currentToken);
      setUserId(decoded.id);
    }

    const handleStorageChange = () => {
      const newT = localStorage.getItem('token');
      setToken(newT);
      if (newT) {
        const decoded: { id: number } = jwtDecode(newT);
        setUserId(decoded.id);
      } else {
        setUserId(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
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
            {token && (
              <LinkContainer to="/create-post">
                <Nav.Link>{t('navbar.createPost')}</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          <Nav>
            {token ? (
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