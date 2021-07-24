import React, {useEffect} from 'react';
import './App.css';
import {Redirect, Route, Switch} from 'react-router-dom';
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
import {Button, Result} from "antd";
import {Nav} from "./components/Nav/Nav";
import logo from '../src/assets/images/logo.png';
import Profile from "./components/Profile/Profile";
import {Actions} from "./components/Messages/Actions";
import {SearchForm} from "./components/Users/SearchForm";

export const App: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const initialised = useSelector(s_getInitialised);
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
                <Route path="/login" render={() => <Login/>}/>
                <Route path="*" render={() => <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary">Back Home</Button>}
                />}/>
            </Switch>
        </div>
    );
}

const MainPage: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    return (
        <>
            {!isAuth ? <Redirect to='/login'/> :
                <div className="content">
                    <div className='wrapper_hamburger'>
                        hamburger
                    </div>
                    <div className='wrapper_links'>
                        links
                    </div>
                    <div className='wrapper_logo'>
                        <img src={logo} alt="logo"/>
                    </div>
                    <div className='wrapper_nav'>
                        <Nav/>
                    </div>
                    <div className='wrapper_search'>
                        <SearchForm/>
                    </div>
                    <div className='wrapper_dialogs'>
                        <Dialogs/>
                    </div>
                    <div className='wrapper_actions'>
                        <Actions/>
                    </div>
                    <div className='wrapper_messages'>
                        {currentDialogId && <Messages/>}
                    </div>
                    <div className='wrapper_profile'>
                        <Profile/>
                    </div>
                </div>
            }
        </>
    )
};
