import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Container, Row, Col, Image, Button, Modal, Form, Tab, Tabs } from 'react-bootstrap';
import PostCard from '../components/PostCard';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { IUser, IPost } from '../types';
import { jwtDecode } from 'jwt-decode';
import { subscribeToUser, unsubscribeFromUser, getFollowing, getFollowers } from '../api';

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
  const [profile, setProfile] = useState<IUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingList, setFollowingList] = useState<IUser[]>([]);
  const [followersList, setFollowersList] = useState<IUser[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: { id: number } = jwtDecode(token);
        setCurrentUserId(decoded.id);
      } catch (error) {
        console.error("Failed to decode token", error);
        setCurrentUserId(null);
      }
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get<IUser>(`/api/users/${id}`);
      setProfile(data);
      if (currentUserId && data.id !== currentUserId) {
        const { data: followingData } = await getFollowing(currentUserId);
        setIsFollowing(followingData.some((user: IUser) => user.id === data.id));
      }
      const { data: fetchedFollowingList } = await getFollowing(parseInt(id!));
      setFollowingList(fetchedFollowingList);
      const { data: fetchedFollowersList } = await getFollowers(parseInt(id!));
      setFollowersList(fetchedFollowersList);
    } catch (error) {
      console.error(t('profilePage.fetchError'), error);
      toast.error(t('profilePage.fetchError'));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, currentUserId]); // Re-fetch when currentUserId changes

  const handleAvatarSelect = async (avatarUrl: string) => {
    try {
      await api.put(
        '/api/users/me/avatar',
        { avatarUrl }
      );
      setShowModal(false);
      fetchProfile(); // Refresh profile to show new avatar
      toast.success(t('profilePage.updateSuccess'));
    } catch (error) {
      console.error(t('profilePage.updateError'), error);
      toast.error(t('profilePage.updateError'));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await api.post('/api/users/me/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowModal(false);
      fetchProfile();
      toast.success(t('profilePage.uploadSuccess'));
    } catch (error) {
      console.error(t('profilePage.uploadError'), error);
      toast.error(t('profilePage.uploadError'));
    }
  };

  const handleSubscribe = async () => {
    if (!profile || !currentUserId) return;
    try {
      await subscribeToUser(profile.id);
      setIsFollowing(true);
      fetchProfile(); // Refresh profile to update follower count
      toast.success(t('profilePage.subscribeSuccess'));
    } catch (error) {
      console.error('Failed to subscribe', error);
      toast.error(t('profilePage.subscribeError'));
    }
  };

  const handleUnsubscribe = async () => {
    if (!profile || !currentUserId) return;
    try {
      await unsubscribeFromUser(profile.id);
      setIsFollowing(false);
      fetchProfile(); // Refresh profile to update follower count
      toast.success(t('profilePage.unsubscribeSuccess'));
    } catch (error) {
      console.error('Failed to unsubscribe', error);
      toast.error(t('profilePage.unsubscribeError'));
    }
  };

  if (!profile) return <div>{t('postDetailsPage.loading')}</div>;

  const isCurrentUserProfile = currentUserId === profile.id;

  return (
    <>
      <Container>
        <Row className="my-4 align-items-center">
          <Col xs={12} md={3} className="text-center">
            <Image src={profile.avatarUrl} roundedCircle width={150} height={150} style={{ cursor: 'pointer' }} onClick={() => setShowModal(true)} />
            {isCurrentUserProfile && (
              <Button variant="link" onClick={() => setShowModal(true)}>{t('profilePage.changeAvatar')}</Button>
            )}
          </Col>
          <Col xs={12} md={9}>
            <h1>{profile.username}</h1>
            <p className="text-muted">{profile.email}</p>
            {!isCurrentUserProfile && currentUserId && (
              isFollowing ? (
                <Button variant="danger" onClick={handleUnsubscribe}>
                  {t('profilePage.unsubscribe')}
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubscribe}>
                  {t('profilePage.subscribe')}
                </Button>
              )
            )}
          </Col>
        </Row>
        <hr />

        <Tabs defaultActiveKey="posts" id="profile-tabs" className="mb-3">
          <Tab eventKey="posts" title={t('profilePage.posts')}>
            <h2>{t('profilePage.postsBy')} {profile.username}</h2>
            {profile.posts && profile.posts.length > 0 ? (
              profile.posts.map((post: IPost) => <PostCard key={post.id} post={post} currentUserId={currentUserId} onDeleteSuccess={fetchProfile} />)
            ) : (
              <p>{t('profilePage.noPosts')}</p>
            )}
          </Tab>
          <Tab eventKey="following" title={`${t('profilePage.following')} (${followingList.length})`}>
            <h2>{t('profilePage.followingList')}</h2>
            {followingList.length > 0 ? (
              followingList.map((user: IUser) => (
                <div key={user.id} className="d-flex align-items-center mb-2">
                  <Image src={user.avatarUrl} roundedCircle width={40} height={40} className="me-2" />
                  <span>{user.username}</span>
                </div>
              ))
            ) : (
              <p>{t('profilePage.noFollowing')}</p>
            )}
          </Tab>
          <Tab eventKey="followers" title={`${t('profilePage.followers')} (${followersList.length})`}>
            <h2>{t('profilePage.followersList')}</h2>
            {followersList.length > 0 ? (
              followersList.map((user: IUser) => (
                <div key={user.id} className="d-flex align-items-center mb-2">
                  <Image src={user.avatarUrl} roundedCircle width={40} height={40} className="me-2" />
                  <span>{user.username}</span>
                </div>
              ))
            ) : (
              <p>{t('profilePage.noFollowers')}</p>
            )}
          </Tab>
        </Tabs>
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