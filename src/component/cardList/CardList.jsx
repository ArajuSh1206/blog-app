"use client";
import React, { useEffect, useState } from "react";
import styles from "./cardList.module.css";
import Card from "../card/Card";
import Pagination from "../pagination/Pagination";

const CardList = ({ page }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); // Track total post count

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts?page=${page}`);
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data.posts);
        setCount(data.count); // Ensure total count is set correctly
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const POSTS_PER_PAGE = 2;
  const totalPages = Math.ceil(count / POSTS_PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.posts}>
          {posts?.map((item) => (
            <Card item={item} key={item._id} />
          ))}
        </div>
      )}
      {/* Pass correct pagination props */}
      <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};

export default CardList;
