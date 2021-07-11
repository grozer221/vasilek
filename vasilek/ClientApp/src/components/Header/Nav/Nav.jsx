import React from 'react';
import s from './Nav.module.css'
import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <nav className={s.nav}>
      <NavLink className={s.navLink} activeClassName={s.active} to="/profile">Профіль</NavLink>
      <NavLink className={s.navLink} activeClassName={s.active} to="/dialogs">Повідомлення</NavLink>
      <NavLink className={s.navLink} activeClassName={s.active} to="/users">Користувачі</NavLink>
      <NavLink className={s.navLink} activeClassName={s.active} to="/news">Новини</NavLink>
      <NavLink className={s.navLink} activeClassName={s.active} to="/music">Музика</NavLink>
      <NavLink className={s.navLink} activeClassName={s.active} to="/settings">Налаштування</NavLink>
    </nav>
  );
}

export default Nav;
