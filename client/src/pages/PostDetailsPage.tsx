import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PostDetailsPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await axios.get(`/api/posts/${id}`);
      setPost(data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <div>{t('postDetailsPage.loading')}</div>;

  return (
    <Container>
      <h1>{post.title}</h1>
      <p className="text-muted">{t('postDetailsPage.author')}: {post.author.username}</p>
      <div>{post.content}</div>
    </Container>
  );
};

export default PostDetailsPage;