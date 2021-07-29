import React, {useEffect, useState} from 'react';
import './App.css';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import {Login} from './components/Login/Login';
import {useDispatch, useSelector} from 'react-redux';
import {initialiseApp} from './redux/app-reducer';
import Loading from './components/common/Loading/Loading';
import 'antd/dist/antd.css';
import {s_getInitialised} from "./redux/app-selectors";
import {s_getIsAuth} from "./redux/auth-selectors";
import {startDialogsListening, stopDialogsListening} from "./redux/dialogs-reducer";
import {s_getCurrentDialogId} from "./redux/dialogs-selectors";
import {Messages} from "./components/Messages/Messages";
import {Dialogs} from "./components/Dialogs/Dialogs";
import {Avatar, Button, Result} from "antd";
import {Nav} from "./components/Nav/Nav";
import logo from '../src/assets/images/logo.png';
import {Profile} from "./components/Info/Profile/Profile";
import {Actions} from "./components/Messages/Actions";
import {Register} from "./components/Register/Register";
import {Users} from "./components/Info/Users/Users";
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";
import s from "./components/Messages/Messages.module.css";
import {Info} from "./components/Info/Info";

export const App: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const initialised = useSelector(s_getInitialised);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuth)
            dispatch(startDialogsListening());
        dispatch(initialiseApp());
        return () => {
            if (isAuth)
                dispatch(stopDialogsListening());
        }
    }, [isAuth]);

    if (!initialised)
        return <Loading/>;

    return (
        <div className='container'>
            <Switch>
                <Route exact path="/" render={() => <MainPage/>}/>
                <Route path="/profile" render={() => <MainPage/>}/>
                <Route path="/users" render={() => <MainPage/>}/>
                <Route path="/dialog" render={() => <MainPage/>}/>
                <Route path="/login" render={() => <Login/>}/>
                <Route path="/register" render={() => <Register/>}/>
                <Route path="*" render={() => <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary" onClick={() => history.push('/')}>Back Home</Button>}
                />}/>
            </Switch>
        </div>
    );
}

const MainPage: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const [isOpenInfoPage, setIsOpenInfoPage] = useState(true);
    if (!isAuth)
        return <Redirect to='/login'/>

    return (
        <>
            <div className={['content', isOpenInfoPage ? '' : 'info_page_close'].join(' ')}>
                <div className='nav'>
                    <Nav/>
                </div>
                <div className='dialogs'>
                    <Dialogs/>
                </div>
                <div className='messages'>
                    <Messages/>
                </div>
                <div className='info_page'>
                    <Info isOpenInfoPage={isOpenInfoPage} setIsOpenInfoPage={setIsOpenInfoPage}/>
                </div>
                {/*<div className='wrapper_hamburger'>*/}
                {/*    hamburger*/}
                {/*</div>*/}
                {/*<div className='wrapper_links'>*/}
                {/*    links*/}
                {/*</div>*/}
                {/*<div className='wrapper_logo'>*/}
                {/*    <Avatar size={64} src={logo} alt="logo"/>*/}
                {/*</div>*/}
                {/*<div className='wrapper_nav'>*/}
                {/*    <Nav/>*/}
                {/*</div>*/}
                {/*<div className='wrapper_search'>*/}
                {/*    /!*<UsersSearchForm/>*!/*/}
                {/*</div>*/}
                {/*<div className='wrapper_dialogs'>*/}
                {/*    <Dialogs/>*/}
                {/*</div>*/}
                {/*<div className='wrapper_actions'>*/}
                {/*    <Actions/>*/}
                {/*</div>*/}
                {/*<div className='wrapper_main_content'>*/}
                {/*    <Route path="/dialog" render={() => <Messages/>}/>*/}
                {/*    <Route path="/profile" render={() => <Profile/>}/>*/}
                {/*    <Route path="/users" render={() => <Users/>}/>*/}
                {/*</div>*/}
            </div>
        </>
    )
};
