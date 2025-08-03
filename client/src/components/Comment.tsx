import React from 'react';
import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Comment = ({ comment }) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex mb-3">
      <Image src={comment.author?.avatarUrl} roundedCircle width={40} height={40} className="me-3" />
      <div>
        <div className="fw-bold">{comment.author?.username || t('postCard.unknown')}</div>
        <small className="text-muted">{new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}</small>
        <p className="mb-0">{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
