import React, { useState, useEffect } from 'react';
import api from '../api';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EditPostPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/api/posts/${id}`);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error('Не удалось загрузить запись для редактирования', error);
        alert('Не удалось загрузить запись для редактирования');
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/api/posts/${id}`,
        { title, content }
      );
      alert(t('editPostPage.successMessage'));
      navigate(`/posts/${id}`);
    } catch (error) {
      alert(t('editPostPage.errorMessage'));
    }
  };

  return (
    <Container>
      <h2>{t('editPostPage.editPost')}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t('editPostPage.title')}</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t('editPostPage.content')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {t('editPostPage.saveChanges')}
        </Button>
      </Form>
    </Container>
  );
};

export default EditPostPage;
