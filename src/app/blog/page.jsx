"use client"; 

import { useSearchParams } from "next/navigation";
import styles from "./blogPage.module.css";
import Menu from "@/component/Menu/Menu";
import CardList from "@/component/cardList/CardList";

function BlogPage() {
  const searchParams = useSearchParams();
  
  const cat = searchParams.get("cat") || "";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{cat} Blog</h1>
      <div className={styles.content}>
        <CardList /> {/* Removed unnecessary props */}
        <Menu />
      </div>
    </div>
  );
};

export default BlogPage;
