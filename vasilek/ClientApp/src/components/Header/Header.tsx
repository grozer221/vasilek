import React from 'react';
import s from './Header.module.css';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser, getIsAuth} from "../../redux/users-selectors";
import {logout} from "../../redux/auth-reducer";
import {Dropdown, Menu, message} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import photo from '../../assets/images/man.png';

let pathToFolderWithPhotos = 'https://vasilek.blob.core.windows.net/userphotoscontainer/';


export const Header: React.FC = (props) => {
    const isAuth = useSelector(getIsAuth);
    const currentUser = useSelector(getCurrentUser);
    const dispatch = useDispatch();
    const logoutCallback = () => {
        dispatch(logout());
    }

    function handleMenuClick(e: any) {
        console.log('click', e);
        switch (e.key) {
            case '1':
                logoutCallback()
                message.info('Yuo logouted');
                break;
        }
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" icon={<UserOutlined/>}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <header className={s.header}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item key="1">
                    <Link className={s.navLink} to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link className={s.navLink} to="/dialogs">Messages</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link className={s.navLink} to="/users?friends=true">Friends</Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link className={s.navLink} to="/users">Users</Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link className={s.navLink} to="/news">News</Link>
                </Menu.Item>
                <Menu.Item key="6">
                    <Link className={s.navLink} to="/music">Music</Link>
                </Menu.Item>
                <Menu.Item key="7">
                    <Link className={s.navLink} to="/settings">Setting</Link>
                </Menu.Item>
            </Menu>
            {isAuth
                ? <div>
                    <Dropdown.Button overlay={menu} placement="bottomCenter" icon={<img src={currentUser?.AvaPhoto === null ? photo : pathToFolderWithPhotos + currentUser?.AvaPhoto}/>}>
                        {currentUser?.Login}
                    </Dropdown.Button>
                </div>
                : <Link to={'/login'}>Login</Link>
            }

        </header>
    );
}

