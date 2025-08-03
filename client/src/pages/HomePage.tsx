import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const HomePage: React.FC = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <img src="/favicon.svg" alt="Blog Logo" width="150" />
          <h1 className="mt-3">Добро пожаловать в наш блог!</h1>
          <p className="lead">Место, где мы делимся мыслями.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
