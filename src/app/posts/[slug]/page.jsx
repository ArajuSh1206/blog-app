"use client";
import React, { useEffect, useState } from 'react';
import styles from './singlePage.module.css';
import Menu from '@/component/Menu/Menu';
import Image from 'next/image';
import Comments from '@/component/comments/Comments';
import { useParams, useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { baseUrl } from '@/utils/api';

const SinglePage = () => {
  const { slug } = useParams(); 
  const router = useRouter();

  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [session, setSession] = useState(null); 

  useEffect(() => {
    // Fetch session information
    const fetchSession = async () => {
      const userSession = await getSession();
      console.log("Session data:", userSession); // Log full session object
      setSession(userSession);
    };
    
    fetchSession();
  }, []);

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
        const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch post');

        const postData = await res.json();
        console.log("Fetched post data:", postData); // Log fetched post data
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/"); 
      } else {
        const errorData = await res.json();
        alert(errorData.message);
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Something went wrong while deleting the post");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  // Check if current user is the author of the post
  console.log("Session user ID:", session?.user); // Log the entire session user
  console.log("Post data:", data?.post); // Log the full post data

  const isAuthor = session?.user?.email === data?.post?.user?.email;

  // Log author check for debugging
  console.log("Is author:", isAuthor); // Log if the user is the author

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{data?.post?.title}
          <span
            className={`${styles.category} ${
              data?.post?.catSlug
                ? styles[data?.post.catSlug.toLowerCase()] || styles.defaultCategory
                : styles.defaultCategory
            }`}
          >
            {data?.post?.catSlug || "Uncategorized"}
          </span>

          </h1>
          <div className={styles.user}>
            {data?.post?.user?.image && (
              <div className={styles.userImageContainer}>
                <Image src={data.post.user.image} alt="" fill className={styles.avatar} />
              </div>
            )}
          <div className={styles.userTextContainer}>
            <span className={styles.username}>{data?.post?.user?.name}</span>
            {new Date(data?.post?.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          </div>

          {/* Only show Delete button if the current user is the post's author */}
          {isAuthor && (
            <div className={styles.postActions}>
              <button 
                onClick={handleDelete}
                className={styles.deleteButton}
              >
                Delete Post
              </button>
            </div>
          )}
        </div>

        {data?.post?.img && (
          <div className={styles.imageContainer}>
            <Image src={data.post.img} alt="" fill className={styles.image} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.post}>
        <div className={styles.description}>
            {(() => {
              if (!data?.post?.desc) return null;

              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = data.post.desc;

              const firstImage = tempDiv.querySelector("img");
              if (firstImage && firstImage.src === data.post.img) {
                firstImage.remove();
              }

              return <div dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }} />;
            })()}
          </div>
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
