import React from 'react'
import styles from "./singlePage.module.css"
import Menu from '@/component/Menu/Menu'
import Image from 'next/image'
import Comments from '@/component/comments/Comments'

const singlePage = () => {
  return (
    <div className = {styles.container}>
      <div className = {styles.infoContainer}>
        <div className = {styles.textContainer}>
          <h1 className = {styles.title}> Lorem ipsum odor amet, consectetuer adipiscing elit. Commodo fringilla sodales ad elit senectus. </h1>
          <div className = {styles.user}>
            <div className = {styles.userImageContainer}>
              <Image src = "/p1.jpeg" alt = "" fill className = {styles.avatar} />
            </div>
            <div className = {styles.userTextContainer}>
              <span className = {styles.username}> John Doe </span>
              <span className = {styles.userTextContainer}> 03.03.2025 </span>
            </div>
          </div>
        </div>
        <div className = {styles.imageContainer}>
          <Image src = "/p1.jpeg" alt = "" fill className = {styles.image} />
        </div>
      </div>
      <div className = {styles.content}>
        <div className = {styles.post}>
          <div className = {styles.description}>
          <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Commodo fringilla sodales ad elit senectus. Lacinia nunc dignissim natoque dictumst maximus molestie fames. Lectus nunc enim elementum class tellus enim arcu congue. Mollis feugiat justo mauris vehicula etiam ut nullam. Scelerisque condimentum nulla tincidunt rhoncus proin risus penatibus sed.
          </p>
          <h2> 
          Lorem ipsum odor amet, consectetuer adipiscing elit.
          </h2>
          <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Commodo fringilla sodales ad elit senectus. Lacinia nunc dignissim natoque dictumst maximus molestie fames. Lectus nunc enim elementum class tellus enim arcu congue. Mollis feugiat justo mauris vehicula etiam ut nullam. Scelerisque condimentum nulla tincidunt rhoncus proin risus penatibus sed.
          </p>
          <p>
          Lorem ipsum odor amet, consectetuer adipiscing elit. Commodo fringilla sodales ad elit senectus. Lacinia nunc dignissim natoque dictumst maximus molestie fames. Lectus nunc enim elementum class tellus enim arcu congue. Mollis feugiat justo mauris vehicula etiam ut nullam. Scelerisque condimentum nulla tincidunt rhoncus proin risus penatibus sed.
          </p>
          </div>
          <div className = {styles.comment} >
          <Comments />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  )
}

export default singlePage