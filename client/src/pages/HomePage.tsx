import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get('/api/posts/public');
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="my-4">{t('homePage.latestPosts')}</h1>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;