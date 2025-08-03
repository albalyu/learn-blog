import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { username, email, password });
      alert(t('registerPage.successMessage'));
      navigate('/login');
    } catch (error) {
      alert(t('registerPage.errorMessage'));
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">{t('registerPage.register')}</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>{t('registerPage.username')}</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('registerPage.enterUsername')}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>{t('registerPage.emailAddress')}</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('registerPage.enterEmail')}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>{t('registerPage.password')}</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('registerPage.enterPassword')}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                {t('registerPage.registerButton')}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;