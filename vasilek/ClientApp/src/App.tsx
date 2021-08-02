import React, {useEffect, useState} from 'react';
import './App.css';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import {Login} from './components/Login/Login';
import {useDispatch, useSelector} from 'react-redux';
import {initialiseApp} from './redux/app-reducer';
import Loading from './components/common/Loading/Loading';
import 'antd/dist/antd.css';
import {s_getInitialised, s_getPageOpened} from "./redux/app-selectors";
import {s_getIsAuth} from "./redux/auth-selectors";
import {startDialogsListening, stopDialogsListening} from "./redux/dialogs-reducer";
import {Messages} from "./components/Messages/Messages";
import {Dialogs} from "./components/Dialogs/Dialogs";
import {Button, Result} from "antd";
import {Nav} from "./components/Nav/Nav";
import {Register} from "./components/Register/Register";
import {Info} from "./components/Info/Info";
import {useMediaQuery} from 'react-responsive'

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
                <Route path="/settings" render={() => <MainPage/>}/>
                <Route path="/dialog" render={() => <MainPage/>}/>
                <Route path="/dialoginfo" render={() => <MainPage/>}/>
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
    const isPhone = useMediaQuery({query: '(max-width: 900px)'})
    const isAuth = useSelector(s_getIsAuth);
    const pageOpened = useSelector(s_getPageOpened);
    const [isOpenInfoPage, setIsOpenInfoPage] = useState(true);
    if (!isAuth)
        return <Redirect to='/login'/>

    return (
        <>
            <div className={['content', isOpenInfoPage ? '' : 'info_page_close'].join(' ')}>
                <div className='nav'>
                    <Nav/>
                </div>
                {(!isPhone || pageOpened === 'dialogs') &&
                <div className='dialogs'>
                    <Dialogs/>
                </div>
                }
                {(!isPhone || pageOpened === 'messages') &&
                <div className='messages'>
                    <Messages/>
                </div>
                }
                {(!isPhone || pageOpened === 'info') &&
                <div className='info_page'>
                    <Info isOpenInfoPage={isOpenInfoPage} setIsOpenInfoPage={setIsOpenInfoPage}/>
                </div>
                }
            </div>
        </>
    )
};
