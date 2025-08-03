import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap'; // Import Card
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PostDetailsPage = ({ currentUserId }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await api.get(`/api/posts/${id}`);
      setPost(data);
    };
    fetchPost();
  }, [id]);

  const isAuthor = currentUserId === post?.author?.id;

  const handleDelete = () => {
    if (window.confirm(t('postCard.confirmDelete'))) {
      // Implement delete logic here
      alert('Удаление записи...');
    }
  };

  if (!post) return <div>{t('postDetailsPage.loading')}</div>;

  return (
    <Container>
      <Card className="mb-3"> {/* Add Card component here */}
        <Card.Body>
          <Row>
            <Col xs={12} md={2} className="text-center border-end post-card-author-col">
              <Image src={post.author?.avatarUrl} roundedCircle width={60} height={60} className="mb-2" />
              <div className="fw-bold">{post.author?.username || t('postCard.unknown')}</div>
              <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString()}</small>
            </Col>
            <Col xs={12} md={10} className="d-flex flex-column">
              <div>
                <h1>{post.title}</h1>
                <p className="text-muted">{t('postDetailsPage.author')}: {post.author.username}</p>
                <div>{post.content}</div>
              </div>
              {isAuthor && (
                <div className="mt-auto text-end">
                  <Button variant="warning" size="sm" className="me-2" as={Link} to={`/posts/${post.id}/edit`}>
                    {t('postCard.edit')}
                  </Button>
                  <Button variant="danger" size="sm" onClick={handleDelete}>
                    {t('postCard.delete')}
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetailsPage;
