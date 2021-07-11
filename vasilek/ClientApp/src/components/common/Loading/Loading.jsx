import React from 'react';
import loading from '../../../assets/images/loading.svg';
import s from './Loading.module.css';

let Loading = (props) => {
  return(
    <div className={s.wrapper_svg}>
      <img src={loading} className={s.svg} />
    </div>
  );
}

export default Loading;