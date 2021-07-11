import React from 'react';
import s from './Post.module.css';

const Post = (props) =>{
  return(
    <div>
      <img src="https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg" alt=""/>
      <span className={s.message}>{props.message}</span>
      <div className={s.likesCount}>like: {props.likesCount}</div>
    </div>
  );
}

export default Post;