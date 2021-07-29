import React from 'react';
import {Avatar} from "antd";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";
import s from './Info.module.css';
import {Route} from "react-router-dom";
import {Users} from "./Users/Users";
import {Profile} from "./Profile/Profile";

type PropsType = {
    isOpenInfoPage: boolean
    setIsOpenInfoPage: (flag: boolean) => void
}

export const Info: React.FC<PropsType> = ({isOpenInfoPage, setIsOpenInfoPage}) => {
    return (
        <div className={s.wrapper_info_page}>
            <div className={s.headerAndArrow}>
                {isOpenInfoPage
                    ? <button onClick={() => setIsOpenInfoPage(false)}>
                        <Avatar icon={<ArrowRightOutlined/>}/>
                    </button>
                    : <button onClick={() => setIsOpenInfoPage(true)}>
                        <Avatar icon={<ArrowLeftOutlined/>}/>
                    </button>
                }
            </div>
            {isOpenInfoPage &&
            <div className={s.info}>
                <Route path={'/users'} component={Users}/>
                <Route path={'/profile'} component={Profile}/>
            </div>
            }
        </div>
    );
}
