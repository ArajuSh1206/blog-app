"use client"; 

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Use to get query params
import styles from "./cardList.module.css";
import Card from "../card/Card";
import Pagination from "../pagination/Pagination";

const POST_PER_PAGE = 2;

const CardList = () => {
  const searchParams = useSearchParams(); // Get params from URL
  const page = Number(searchParams.get("page")) || 1; // Ensure it's a number
  const cat = searchParams.get("cat") || ""; // Get category if exists

  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!page) return; // Prevent unnecessary fetch

    const getData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/posts?page=${page}&cat=${cat}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data.posts);
        setCount(data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [page, cat]);

  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recent Posts</h1>

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className={styles.posts}>
            {posts?.map((item) => (
              <Card item={item} key={item._id} />
            ))}
          </div>
          <Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
        </>
      )}
    </div>
  );
};

export default CardList;
