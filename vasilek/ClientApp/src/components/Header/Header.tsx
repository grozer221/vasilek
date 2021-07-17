import React from 'react';
import s from './Header.module.css';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {getCurrentUser, getIsAuth} from "../../redux/users-selectors";
import {logout} from "../../redux/auth-reducer";
import {Avatar, Dropdown, Menu, message} from 'antd';
import {SettingOutlined, UserOutlined} from '@ant-design/icons';
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
            case '2':
                logoutCallback()
                message.info('You logout');
                break;
        }
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" icon={<SettingOutlined />}>
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
                ? <div>
                    <Dropdown.Button overlay={menu}
                                     placement="bottomCenter"
                                     icon={<Avatar
                                         icon={<img
                                             src={currentUser?.AvaPhoto === null ? photo : pathToFolderWithPhotos + currentUser?.AvaPhoto}/>}
                                         shape="square"
                                         size={28}/>
                                     }>
                        {currentUser?.Login}
                    </Dropdown.Button>
                </div>
                : <Link to={'/login'}>Login</Link>
            }

        </header>
    );
}

