import React from 'react';
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PostCard = ({ post, currentUserId }) => {
  const { t } = useTranslation();

  const isAuthor = currentUserId === post.author?.id;

  const handleDelete = () => {
    if (window.confirm(t('postCard.confirmDelete'))) {
      // Implement delete logic here
      alert('Удаление записи...');
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row>
          <Col xs={12} md="auto" className="text-center border-end post-card-author-col">
            <Image src={post.author?.avatarUrl} roundedCircle width={60} height={60} className="mb-2" />
            <div className="fw-bold">{post.author?.username || t('postCard.unknown')}</div>
            <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString()}</small>
          </Col>
          <Col xs={12} md={true} className="d-flex flex-column">
            <div>
              <Card.Title>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </Card.Title>
              <Card.Text>{post.content.substring(0, 150)}...</Card.Text>
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
  );
};

export default PostCard;
