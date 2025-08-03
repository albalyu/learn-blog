import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PostCard = ({ post }) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{t('postCard.author')}: {post.author?.username || t('postCard.unknown')}</Card.Subtitle>
        <Card.Text>{post.content.substring(0, 100)}...</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PostCard;