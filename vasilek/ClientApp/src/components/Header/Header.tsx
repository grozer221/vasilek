import React from 'react';
import s from './Header.module.css';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/auth-reducer";
import {Avatar, Dropdown, Menu, message} from 'antd';
import {DownOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import userWithoutPhoto from '../../assets/images/man.png';
import {urls} from "../../api/api";
import {s_getCurrentUser, s_getIsAuth} from "../../redux/auth-selectors";

export const Header: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const currentUser = useSelector(s_getCurrentUser);
    const dispatch = useDispatch();
    const history = useHistory();

    const logoutCallback = () => {
        dispatch(logout());
        message.info('You logout');
        history.push({pathname: "/login"});
    }

    const handleMenuClick = (e: any) => {
        console.log('click', e);
        switch (e.key) {
            case '2':
                logoutCallback()
                break;
        }
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" icon={<SettingOutlined/>}>
                <Link to="/settings">Setting</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined/>}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <header className={s.header}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/dialogs">Messages</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/chat">Chat</Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link to="/users?friends=true">Friends</Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link to="/users">Users</Link>
                </Menu.Item>
                <Menu.Item key="6">
                    <Link to="/news">News</Link>
                </Menu.Item>
                <Menu.Item key="7">
                    <Link to="/music">Music</Link>
                </Menu.Item>
            </Menu>
            {isAuth
                ? <div className={s.nameAndPhoto}>
                    <div>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                {currentUser?.NickName}
                                <DownOutlined/>
                            </a>
                        </Dropdown>
                    </div>
                    <div>
                        <Link to="/profile">
                            <Avatar
                                icon={<img
                                    src={currentUser?.AvaPhoto === null ? userWithoutPhoto : urls.pathToUsersPhotos + currentUser?.AvaPhoto}
                                    alt="Ava"
                                />}/>
                        </Link>
                    </div>
                </div>
                : <Link to={'/login'}>Login</Link>
            }
        </header>
    );
}



