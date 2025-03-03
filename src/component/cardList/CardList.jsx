import styles from "./cardList.module.css"
import Pagination from '../pagination/Pagination'
import Card from "../card/Card"

const CardList = () => {
  return (
    <div className = {styles.container}> 
      <h1 className = {styles.tite}> Recent Posts </h1>
        <div className = {styles.post}>
          <Card />
          <Card />
          <Card />
    </div>
    <Pagination />
  </div>
  )
}

export default CardList
