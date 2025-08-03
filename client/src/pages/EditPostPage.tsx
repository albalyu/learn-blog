import { useState, useEffect } from 'react';
import api from '../api';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { IPost, ITag } from '../types';

const EditPostPage: React.FC = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); // New state for tags
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get<IPost>(`/api/posts/${id}`);
        setTitle(data.title);
        setContent(data.content);
        setTags(data.tags?.map((tag: ITag) => tag.name).join(', ') || ''); // Set tags from fetched data
      } catch (error) {
        console.error('Не удалось загрузить запись для редактирования', error);
        toast.error('Не удалось загрузить запись для редактирования');
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    try {
      await api.put(
        `/api/posts/${id}`,
        { title, content, tags: tagsArray }
      );
      toast.success(t('editPostPage.successMessage'));
      window.dispatchEvent(new Event('postUpdated')); // Dispatch custom event
      navigate(`/posts/${id}`);
    } catch (error) {
      toast.error(t('editPostPage.errorMessage'));
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
        <Form.Group className="mb-3">
          <Form.Label>{t('editPostPage.tags')}</Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder={t('editPostPage.tagsPlaceholder')}
          />
          <Form.Text className="text-muted">
            {t('editPostPage.tagsHint')}
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          {t('editPostPage.saveChanges')}
        </Button>
      </Form>
    </Container>
  );
};

export default EditPostPage;
