import React from 'react';
import s from './Loading.module.css';
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";

const Loading: React.FC = () => {
    return (
        <div className={s.wrapper_svg}>
            <Spin indicator={<LoadingOutlined style={{fontSize: 96}} spin/>}/>
        </div>
    );
}

export default Loading;