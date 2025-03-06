"use client";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import Featured from "@/component/featured/Featured";
import styles from "./homepage.module.css";
import CategoryList from "@/component/categoryList/CategoryList";
import CardList from "@/component/cardList/CardList";
import Menu from "@/component/Menu/Menu";

export default function Home() {
  const searchParams = useSearchParams(); 
  const page = parseInt(searchParams.get("page") || "1", 10); 
  
  return (
    <div className={styles.container}>
      <Featured />
      <CategoryList />
      <div className={styles.content}>
        <CardList page={page} />
        <Menu />
      </div>
    </div>
  );
}
