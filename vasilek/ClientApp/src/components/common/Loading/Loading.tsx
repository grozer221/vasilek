import React from 'react';
import loading from '../../../assets/images/loading.svg';
import s from './Loading.module.css';

const Loading: React.FC = () => {
    return (
        <div className={s.wrapper_svg}>
            <img src={loading} className={s.svg}/>
        </div>
    );
}

export default Loading;