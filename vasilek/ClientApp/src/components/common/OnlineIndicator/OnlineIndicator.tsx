import React from 'react';
import s from './OnlineIndicator.module.css';

type Props = {
    backgroundColor: string,
    width: string,
    height: string
    left: string,
    bottom: string,
}

export const OnlineIndicator: React.FC<Props> = ({backgroundColor, width, height, bottom, left}) => {
    return (
        <div className={s.wrapper_circle_online} style={{backgroundColor: backgroundColor, width: width, height: height, bottom: bottom, left: left}}>
            <div className={s.circle_online}/>
        </div>
    );
}