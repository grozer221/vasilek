import React from 'react';
import {Avatar} from "antd";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";
import s from './Info.module.css';
import {Route} from "react-router-dom";
import {Users} from "./Users/Users";
import {Profile} from "./Profile/Profile";
import {Settings} from "./Settings/Settings";
import {DialogInfo} from "./DialogInfo/DialogInfo";

type PropsType = {
    isOpenInfoPage: boolean
    setIsOpenInfoPage: (flag: boolean) => void
}

export const Info: React.FC<PropsType> = ({isOpenInfoPage, setIsOpenInfoPage}) => {
    return (
        <div className={s.wrapper_info_page}>
            <div className={s.header}>
                {isOpenInfoPage
                    ? <div className={s.arrow_and_title}>
                        <button onClick={() => setIsOpenInfoPage(false)}>
                            <Avatar icon={<ArrowRightOutlined/>}/>
                        </button>
                        <Route path={'/users'} render={() => <h2>Users</h2>}/>
                        <Route path={'/profile'} render={() => <h2>Profile</h2>}/>
                        <Route exact path={'/settings'} render={() => <h2>Settings</h2>}/>
                        <Route exact path={'/settings/changepass'} render={() => <h2>Change password</h2>}/>
                        <Route path={'/dialoginfo'} render={() => <h2>DialogInfo</h2>}/>
                    </div>
                    : <button onClick={() => setIsOpenInfoPage(true)}>
                        <Avatar icon={<ArrowLeftOutlined/>}/>
                    </button>
                }
            </div>
            {isOpenInfoPage &&
            <div className={s.info}>
                <Route path={'/users'} component={Users}/>
                <Route path={'/profile'} component={Profile}/>
                <Route exact path={'/settings'} component={Settings}/>
                <Route exact path={'/settings/changepass'} component={Settings}/>
                <Route path={'/dialoginfo'} component={DialogInfo}/>
                <Route exact path={'/'} render={() => <div className={s.warning}>No option selected</div>}/>
            </div>
            }
        </div>
    );
}
