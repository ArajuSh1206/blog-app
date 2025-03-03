import Featured from "@/component/featured/Featured";
import styles from "./homepage.module.css"; 
import CategoryList from "@/component/categoryList/CategoryList";
import CardList from "@/component/cardList/CardList";
import Menu from "@/component/Menu/Menu";


export default function Home() {
  return <div className = {styles.container}>
    <Featured />
    <CategoryList />
    <div className = {styles.content}>
      <CardList />
      <Menu />
    </div>
    </div>
}
