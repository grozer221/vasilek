import React from 'react';
import s from './Dialog.module.css'
import {NavLink} from 'react-router-dom';

type PropsType = {
    id: number
    login: string
}

const Dialog: React.FC<PropsType> = (props) => {
    return (
        <NavLink to={'/dialogs/' + props.id} activeClassName={s.active} className={s.dialog}>{props.login}</NavLink>
    );
}

export default Dialog;
