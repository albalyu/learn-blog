import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Container, Row, Col, Image, Button, Modal, Form } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { useTranslation } from 'react-i18next';

const defaultAvatarPaths = [
  '/uploads/default-avatars/male-avatar-1.svg',
  '/uploads/default-avatars/male-avatar-2.svg',
  '/uploads/default-avatars/male-avatar-3.svg',
  '/uploads/default-avatars/male-avatar-4.svg',
  '/uploads/default-avatars/male-avatar-5.svg',
  '/uploads/default-avatars/female-avatar-1.svg',
  '/uploads/default-avatars/female-avatar-2.svg',
  '/uploads/default-avatars/female-avatar-3.svg',
  '/uploads/default-avatars/female-avatar-4.svg',
  '/uploads/default-avatars/female-avatar-5.svg',
];

const ProfilePage: React.FC = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/api/users/${id}`);
      setProfile(data);
    } catch (error) {
      console.error(t('profilePage.fetchError'), error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleAvatarSelect = async (avatarUrl: string) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      await api.put(
        '/api/users/avatar',
        { avatarUrl },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setShowModal(false);
      fetchProfile(); // Refresh profile to show new avatar
    } catch (error) {
      console.error(t('profilePage.updateError'), error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/api/users/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setShowModal(false);
      fetchProfile();
    } catch (error) {
      console.error(t('profilePage.uploadError'), error);
    }
  };

  if (!profile) return <div>{t('postDetailsPage.loading')}</div>;

  return (
    <>
      <Container>
        <Row className="my-4 align-items-center">
          <Col xs={12} md={3} className="text-center">
            <Image src={profile.avatarUrl} roundedCircle width={150} height={150} style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)} />
            <Button variant="link" onClick={() => setShowModal(true)}>{t('profilePage.changeAvatar')}</Button>
          </Col>
          <Col xs={12} md={9}>
            <h1>{profile.username}</h1>
            <p className="text-muted">{profile.email}</p>
          </Col>
        </Row>
        <hr />
        <h2>{t('profilePage.postsBy')} {profile.username}</h2>
        {profile.posts && profile.posts.length > 0 ? (
          profile.posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p>{t('profilePage.noPosts')}</p>
        )}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('profilePage.chooseAvatar')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {defaultAvatarPaths.map((path, index) => (
              <Col key={index} xs={4} md={3} className="text-center mb-3">
                <Image
                  src={path}
                  roundedCircle
                  width={80}
                  height={80}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleAvatarSelect(path)}
                />
              </Col>
            ))}
          </Row>
          <hr />
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>{t('profilePage.uploadOwn')}</Form.Label>
            <Form.Control type="file" onChange={handleFileUpload} />
          </Form.Group>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfilePage;
