import React, { useState, useEffect } from 'react';
import api from '../api';
import { Container, Row, Col, Form } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = ({ currentUserId }) => {
  const [posts, setPosts] = useState([]);
  const [filterTag, setFilterTag] = useState('');
  const { t } = useTranslation();

  const fetchPosts = async () => {
    let url = '/api/posts';
    if (filterTag) {
      url = `/api/posts?tag=${filterTag}`;
    }
    const { data } = await api.get(url);
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();

    const handlePostUpdate = () => {
      fetchPosts();
    };

    window.addEventListener('postUpdated', handlePostUpdate);

    return () => {
      window.removeEventListener('postUpdated', handlePostUpdate);
    };
  }, [filterTag]); // Re-fetch when filterTag changes

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="filterTag">
            <Form.Label>{t('homePage.filterByTag')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('homePage.filterTagPlaceholder')}
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1 className="my-4">{t('homePage.latestPosts')}</h1>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} onDeleteSuccess={fetchPosts} />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
