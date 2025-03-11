"use client";
import React, { useEffect, useState } from 'react';
import styles from './singlePage.module.css';
import Menu from '@/component/Menu/Menu';
import Image from 'next/image';
import Comments from '@/component/comments/Comments';
import { useParams } from 'next/navigation';

const SinglePage = () => {
  const { slug } = useParams(); 
  console.log('slug:', slug);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      if (!slug) {
        setError('Slug is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch post');

        const postData = await res.json();
        setData(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getData(); 
    }
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.post?.title}</h1>
          <div className={styles.user}>
            {data?.post?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image src={data.post.user.image} alt="" fill className={styles.avatar} />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{data?.post?.user?.name}</span>
              <span className={styles.date}>01.01.2024</span>
            </div>
          </div>
        </div>
        {data?.post?.img && (
          <div className={styles.imageContainer}>
            <Image src={data.post.img} alt="" fill className={styles.image} />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: data?.post?.desc }}
          />
          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );  
};

export default SinglePage;
