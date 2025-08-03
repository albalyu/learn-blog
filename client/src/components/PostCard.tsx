import { useState } from 'react';
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../api';
import ConfirmationModal from './ConfirmationModal';
import type { IPost, ITag } from '../types';

interface PostCardProps {
  post: IPost;
  currentUserId: number | null;
  onDeleteSuccess: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onDeleteSuccess }) => {
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const isAuthor = currentUserId === post.author?.id;

  const handleDelete = async () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      await api.delete(`/api/posts/${post.id}`);
      toast.success(t('postCard.deleteSuccess'));
      onDeleteSuccess();
    } catch (error) {
      toast.error(t('postCard.deleteError'));
    }
  };

  return (
    <>
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
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2">
                {post.tags.map((tag: ITag) => (
                  <span key={tag.id} className="badge bg-info text-dark me-1">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
              </div>
              {isAuthor && (
                <div className="mt-auto text-end">
                  <Button variant="warning" size="sm" className="me-2" as={Link as any} to={`/posts/${post.id}/edit`}>
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

      <ConfirmationModal
        show={showConfirmModal}
        title={t('postCard.delete')}
        message={t('postCard.confirmDelete')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default PostCard;