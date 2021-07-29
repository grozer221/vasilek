import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import s from './Nav.module.css';
import {logout} from "../../redux/auth-reducer";
import {Avatar, message} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {actions} from "../../redux/dialogs-reducer";
import {s_getCurrentUser} from "../../redux/auth-selectors";
import logo from '../../../src/assets/images/logo.png';
import {urls} from "../../api/api";
import userWithoutPhoto from '../../assets/images/man.png';
import {ExclamationOutlined, LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";


export const Nav: React.FC = () => {
    const currentUser = useSelector(s_getCurrentUser)
    const dispatch = useDispatch();
    const history = useHistory();
    const logoutCallback = () => {
        dispatch(logout());
        message.info('You logout');
        history.push({pathname: "/login"});
    }

    return (
        <div className={s.nav}>
            <div>
                <button onClick={() => dispatch(actions.setCurrentDialogId(null))}>
                    <Link to={'/'}>
                        <Avatar size={40} src={logo}/>
                    </Link>
                </button>
            </div>
            <div className={s.nav_items}>
                <button>
                    <Link to={'/users'}>
                        <Avatar size={40} icon={<UserOutlined/>}/>
                    </Link>
                </button>
                <button>
                    <Link to={''}>
                        <Avatar size={40} icon={<ExclamationOutlined/>}/>
                    </Link>
                </button>
                <button>
                    <Link to={''}>
                        <Avatar size={40} icon={<ExclamationOutlined/>}/>
                    </Link>
                </button>
                <button>
                    <Link to={''}>
                        <Avatar size={40} icon={<SettingOutlined/>}/>
                    </Link>
                </button>
                <button>
                    <Link to={''} onClick={logoutCallback}>
                        <Avatar size={40} icon={<LogoutOutlined/>}/>
                    </Link>
                </button>
            </div>
            <div>
                <Avatar size={40}
                        src={urls.pathToUsersPhotos ? urls.pathToUsersPhotos + currentUser?.avaPhoto : userWithoutPhoto}/>
            </div>
        </div>
    );
}



