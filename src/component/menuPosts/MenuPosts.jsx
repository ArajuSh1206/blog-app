"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./menuPosts.module.css";

const MenuPosts = ({ withImage }) => {
  const [topPosts, setTopPosts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        console.log("Fetching top 4 posts...");
        const res = await fetch("/api/posts/most-viewed?top4=true");
        
        if (!res.ok) {
          console.error("Response not OK:", res.status, res.statusText);
          throw new Error(`Failed to fetch top posts: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Received data:", data);
        
        // Handle both array and single object responses
        const postsArray = Array.isArray(data) ? data : (data && !data.message ? [data] : []);
        setTopPosts(postsArray);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  // Check loading and error states
  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  
  return (
    <div className={styles.items}>
      {topPosts.length > 0 ? (
        topPosts.map((post) => (
          <Link key={post.slug || post.id} href={`/posts/${post.slug}`} className={styles.item}>
            {withImage && post.img && (
              <div className={styles.imageContainer}>
                <Image src={post.img} alt={post.title} fill className={styles.image} />
              </div>
            )}
            <div className={styles.textContainer}>
            <span className={`${styles.category} ${post.catSlug ? styles[post.catSlug.toLowerCase()] || styles.defaultCategory : styles.defaultCategory}`}>
              {post.catSlug || "Uncategorized"}
              </span>

              <h3 className={styles.postTitle}>{post.title}</h3>
              <div className={styles.detail}>
                <span className={styles.username}>{post.user?.name}</span>
                <span className={styles.date}>
                  {" "} - {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
}

export default MenuPosts;