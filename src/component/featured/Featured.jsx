"use client";
import React, { useEffect, useState } from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Featured = () => {
  const [post, setPost] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMostViewedPost = async () => {
      try {
        const res = await fetch("/api/posts/most-viewed");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching most viewed post:", error);
      }
    };

    fetchMostViewedPost();
  }, []);

  if (!post) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Hey, Guff blog here!</b> Check out my stories and creative ideas.
      </h1>
      <div className={styles.post}>
        <div className={styles.imgContainer}>
          <Image src={post.img || "/placeholder.jpg"} alt={post.title} fill className={styles.image} />
        </div>
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <p className={styles.postDesc}>{post.desc.substring(0, 150)}...</p>
          <button className={styles.button} onClick={() => router.push(`/posts/${post.slug}`)}>
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
