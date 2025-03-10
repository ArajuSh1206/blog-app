import styles from "./blogPage.module.css";
import Menu from "@/component/Menu/Menu";
import CardList from "@/component/cardList/CardList";

function BlogPage({ searchParams }) {
  const page = parseInt(searchParams?.page || "1", 10);
    const cat = searchParams?.cat ?? "";

    return (
        <div className={styles.container}>
          <h1 className={styles.title}> {cat} Blog</h1>
          <div className={styles.content}>
            <CardList page = {page} cat = {cat} />
            <Menu />
          </div>
        </div>
      );
    };

export default BlogPage
