import React from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PostCard = ({ post }) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row>
          <Col xs={12} md="auto" className="text-center border-end post-card-author-col">
            <Image src={post.author?.avatarUrl} roundedCircle width={60} height={60} className="mb-2" />
            <div className="fw-bold">{post.author?.username || t('postCard.unknown')}</div>
            <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString()}</small>
          </Col>
          <Col xs={12} md={true}>
            <Card.Title>
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </Card.Title>
            <Card.Text>{post.content.substring(0, 150)}...</Card.Text>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
