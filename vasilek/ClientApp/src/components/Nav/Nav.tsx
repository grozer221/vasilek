import React from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import s from './Nav.module.css';
import {logout} from "../../redux/auth-reducer";
import {Divider, message} from "antd";
import {useDispatch} from "react-redux";

export const Nav: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const logoutCallback = () => {
        dispatch(logout());
        message.info('You logout');
        history.push({pathname: "/login"});
    }

    return (
        <div className={s.nav}>
            <button>item1</button>
            <button>item2</button>
            <button>item3</button>
            <button>item4</button>
            <button>item5</button>
            <Divider style={{backgroundColor:"#48536c"}} />
            <button>Settings</button>
            <button onClick={logoutCallback}>Logout</button>
        </div>
    );
}



