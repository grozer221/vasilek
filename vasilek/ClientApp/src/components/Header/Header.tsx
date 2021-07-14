import React from 'react';
import s from './Header.module.css';
import Nav from './Nav/Nav';
import { NavLink } from 'react-router-dom';

export type MapPropsType = {
    isAuth: boolean
    login: string | null
}

export type MapDispatchType = {
    logout: () => void
}

const Header: React.FC<MapPropsType & MapDispatchType> = (props) => {
  return (
    <header className={s.header}>
      <div className={s.wrapper_nav}>
        <div className={s.logo}><NavLink to='/'>VASILEK</NavLink></div>
        <Nav/>
      </div>
      <div className={s.loginBlock}>
        { props.isAuth
          ? <div><div>{props.login}</div><button onClick={props.logout}>Logout</button></div>
          : <NavLink to={'/login'}>Login</NavLink>}
      </div>
    </header>
  );
}

export default Header;
