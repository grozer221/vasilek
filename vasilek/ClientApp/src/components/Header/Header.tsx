import React from 'react';
import s from './Header.module.css';
import Nav from './Nav/Nav';
import {NavLink} from 'react-router-dom';

export type MapPropsType = {
    IsAuth: boolean
    Login: string | null
}

export type MapDispatchType = {
    Logout: () => void
}

const Header: React.FC<MapPropsType & MapDispatchType> = (props) => {
    return (
        <header className={s.header}>
            <div className={s.wrapper_nav}>
                <div className={s.logo}><NavLink to='/'>VASILEK</NavLink></div>
                <Nav/>
            </div>
            <div className={s.loginBlock}>
                {props.IsAuth
                    ? <div>
                        <div>{props.Login}</div>
                        <div>
                            <button onClick={props.Logout}>Logout</button>
                        </div>
                    </div>
                    : <NavLink to={'/login'}>Login</NavLink>
                }
            </div>
        </header>
    );
}

export default Header;
