import React from 'react';
import s from './Dialog.module.css'
import { NavLink } from 'react-router-dom';

function Dialog(props) {
  return (
      <NavLink to={'/dialogs/' + props.id} activeClassName={s.active} className={s.dialog}>{props.name}</NavLink>
  );
}

export default Dialog;
