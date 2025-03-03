import React from 'react'
import styles from "./card.module.css"
import Image from 'next/image'
import Link from 'next/link'

const Card = () => {
  return (
    <div className = {styles.container}>
        <div className = {styles.post}>
        <div className = {styles.imageContainer}>
            <Image src = "/p1.jpeg" alt = "" className = {styles.image} fill  />
    </div>
        <div className = {styles.textContainer}></div>
        <div className = {styles.detail}>
            <span className = {styles.date}> 03.02.2025 </span>
            <span className = {styles.category}> CULTURE </span>
        </div>
        <Link href ="/">
        <h1> Lorem ipsum odor amet, consectetuer adipiscing elit. Commodo fringilla sodales ad elit senectus. </h1>
        </Link>
        <p className={styles.desc}> Lorem ipsum odor amet, consectetuer adipiscing elit. Commodo fringilla sodales ad elit senectus. Lacinia nunc dignissim natoque dictumst maximus molestie fames. Lectus nunc enim elementum class tellus enim arcu congue. Mollis feugiat justo mauris vehicula etiam ut nullam. Scelerisque condimentum nulla tincidunt rhoncus proin risus penatibus sed.  </p>
        <Link href = "/" className ={styles.link}> Read More </Link>
    </div>
</div>
  )
}

export default Card
