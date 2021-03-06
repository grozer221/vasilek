import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import s from './Nav.module.css';
import {logout} from '../../redux/auth-reducer';
import {Avatar} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {actions} from '../../redux/dialogs-reducer';
import {actions as appActions} from '../../redux/app-reducer';
import {s_getCurrentUser} from '../../redux/auth-selectors';
import logo from '../../../src/assets/images/logo.png';
import {urls} from '../../api/api';
import userWithoutPhoto from '../../assets/images/man.png';
import {AndroidOutlined, LogoutOutlined, SettingOutlined, UsergroupAddOutlined} from '@ant-design/icons';

type Props = {
    isOpenInfoPage: boolean
    setIsOpenInfoPage: (flag: boolean) => void
}

export const Nav: React.FC<Props> = ({isOpenInfoPage, setIsOpenInfoPage}) => {
    const currentUser = useSelector(s_getCurrentUser)
    const dispatch = useDispatch();
    const history = useHistory();
    const logoutCallback = () => {
        dispatch(logout());
        dispatch(actions.dialogsReceived([]));
        history.push({pathname: "/login"});
    }

    const clickHomeHandler = () => {
        dispatch(actions.setCurrentDialogId(null))
        dispatch(appActions.setPageOpened('dialogs'))
    }

    const clickNavItemHandler = () => {
        dispatch(appActions.setPageOpened('info'));
        if(!isOpenInfoPage)
            setIsOpenInfoPage(true);
    }

    return (
        <div className={s.nav}>
            <div>
                <button onClick={clickHomeHandler}>
                    <Link to={'/'}>
                        <Avatar size={40} src={logo}/>
                    </Link>
                </button>
            </div>
            <div className={s.nav_items}>
                <button onClick={clickNavItemHandler}>
                    <Link to={'/users'}>
                        <Avatar size={40} icon={<UsergroupAddOutlined/>}/>
                    </Link>
                </button>
                <button onClick={clickNavItemHandler}>
                    <Link to={'/settings'}>
                        <Avatar size={40} icon={<SettingOutlined/>}/>
                    </Link>
                </button>
                <button>
                    <a href={'https://vasilekblobstorage.blob.core.windows.net/system/vasilek.apk'}>
                        <Avatar size={40} icon={<AndroidOutlined/>}/>
                    </a>
                </button>
                <button>
                    <Link to={''} onClick={logoutCallback}>
                        <Avatar size={40} icon={<LogoutOutlined/>}/>
                    </Link>
                </button>
            </div>
            <div>
                <Avatar size={40}
                        src={currentUser.avaPhoto ? urls.pathToUsersPhotos + currentUser.avaPhoto : userWithoutPhoto}/>
            </div>
        </div>
    );
}



