import React, { useState, useEffect } from 'react';
import api from '../api';
import { Container, Row, Col, Form, Tabs, Tab } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { useTranslation } from 'react-i18next';
import type { IPost } from '../types';
import { getFollowingPosts } from '../api';

interface HomePageProps {
  currentUserId: number | null;
}

const HomePage: React.FC<HomePageProps> = ({ currentUserId }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [filterTag, setFilterTag] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'following'
  const { t } = useTranslation();

  const fetchPosts = async () => {
    let url = '/api/posts';
    if (filterTag) {
      url = `/api/posts?tag=${filterTag}`;
    }
    const { data } = await api.get<IPost[]>(url);
    setPosts(data);
  };

  const fetchFollowingPosts = async () => {
    try {
      const { data } = await getFollowingPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch following posts', error);
      setPosts([]);
    }
  };

  useEffect(() => {
    if (activeTab === 'all') {
      fetchPosts();
    } else if (activeTab === 'following' && currentUserId) {
      fetchFollowingPosts();
    } else {
      setPosts([]); // Clear posts if not logged in and on following tab
    }

    const handlePostUpdate = () => {
      if (activeTab === 'all') {
        fetchPosts();
      } else if (activeTab === 'following' && currentUserId) {
        fetchFollowingPosts();
      }
    };

    window.addEventListener('postUpdated', handlePostUpdate);

    return () => {
      window.removeEventListener('postUpdated', handlePostUpdate);
    };
  }, [filterTag, activeTab, currentUserId]);

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
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k as string)} className="mb-3">
        <Tab eventKey="all" title={t('homePage.allPosts')}>
          <Row>
            <Col>
              <h1 className="my-4">{t('homePage.latestPosts')}</h1>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUserId={currentUserId} onDeleteSuccess={fetchPosts} />
                ))
              ) : (
                <p>{t('homePage.noPosts')}</p>
              )}
            </Col>
          </Row>
        </Tab>
        {currentUserId && (
          <Tab eventKey="following" title={t('homePage.followingPosts')}>
            <Row>
              <Col>
                <h1 className="my-4">{t('homePage.postsFromFollowing')}</h1>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} currentUserId={currentUserId} onDeleteSuccess={fetchFollowingPosts} />
                  ))
                ) : (
                  <p>{t('homePage.noFollowingPosts')}</p>
                )}
              </Col>
            </Row>
          </Tab>
        )}
      </Tabs>
    </Container>
  );
};

export default HomePage;
