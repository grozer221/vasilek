import React from 'react';
import s from './Users.module.css';
import photo from '../../assets/images/man.png';
import { NavLink } from 'react-router-dom';

let Users = ({ user, followingInProgress, follow, unfollow, followedUsers }) => {
  return (
    <div className={s.wrapper_user}>
      <div className={s.photoANDbtn}>
        <div>
          <NavLink to={'/profile/' + user.id}>
            <img src={user.photo_small !== null ? user.photo_small : photo}/>
          </NavLink>
        </div>
        <div>
            {followedUsers.some(id => id === user.id)
            ? <button disabled={followingInProgress
                .some(id => id === user.id)} onClick={() => unfollow(user.id)}
            >UnFollow</button>

            : <button disabled={followingInProgress
                .some(id => id === user.id)} onClick={() => follow(user.id)}
            >Follow</button>}
        </div>
      </div>
      <div className={s.userInfo}>
        <div>
          <div>{user.login}</div>
          <div>{user.fistname}</div>
          <div>{user.lastname}</div>
          <div>{user.status}</div>
        </div>
        <div>
          <div>{user.city}</div>
          <div>{user.country}</div>
        </div>
      </div>
    </div>
  );
};

export default Users;