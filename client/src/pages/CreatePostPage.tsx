import React, { useState } from 'react';
import api from '../api';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        '/api/posts',
        { title, content }
      );
      toast.success(t('createPostPage.successMessage'));
      navigate('/');
    } catch (error) {
      toast.error(t('createPostPage.errorMessage'));
    }
  };

  return (
    <Container>
      <h2>{t('createPostPage.createPost')}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t('createPostPage.title')}</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('createPostPage.content')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {t('createPostPage.createButton')}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePostPage;