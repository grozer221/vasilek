import React from 'react';
import s from './Nav.module.css'
import {NavLink} from 'react-router-dom';

const Nav: React.FC = () => {
    return (
        <nav className={s.nav}>
            <NavLink className={s.navLink} activeClassName={s.active} to="/profile">Profile</NavLink>
            <NavLink className={s.navLink} activeClassName={s.active} to="/dialogs">Messages</NavLink>
            <NavLink className={s.navLink} activeClassName={s.active} to="/friends">Friends</NavLink>
            <NavLink className={s.navLink} activeClassName={s.active} to="/users">Users</NavLink>
            <NavLink className={s.navLink} activeClassName={s.active} to="/news">News</NavLink>
            <NavLink className={s.navLink} activeClassName={s.active} to="/music">Music</NavLink>
            <NavLink className={s.navLink} activeClassName={s.active} to="/settings">Setting</NavLink>
        </nav>
    );
}

export default Nav;
