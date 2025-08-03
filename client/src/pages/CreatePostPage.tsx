import React, { useState } from 'react';
import api from '../api';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); // New state for tags
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    try {
      await api.post(
        '/api/posts',
        { title, content, tags: tagsArray }
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
        <Form.Group className="mb-3">
          <Form.Label>{t('createPostPage.tags')}</Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={t('createPostPage.tagsPlaceholder')}
          />
          <Form.Text className="text-muted">
            {t('createPostPage.tagsHint')}
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          {t('createPostPage.createButton')}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePostPage;
