import React, {useEffect} from 'react';
import './App.css';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import ProfileContainer from './components/Profile/ProfileContainer';
import {Login} from './components/Login/Login';
import {connect, useDispatch, useSelector} from 'react-redux';
import {initialiseApp} from './redux/app-reducer';
import Loading from './components/common/Loading/Loading';
import {compose} from 'redux';
import {AppStateType} from "./redux/redux-store";
import {Users} from "./components/Users/Users";
import 'antd/dist/antd.css';
import {Button, Layout, Result} from 'antd';
import {Header} from "./components/Header/Header";
import {ChatPage} from "./components/pages/Chat/ChatPage";
import {startMessagesListening, stopMessagesListening} from "./redux/chat-reducer";
import {getIsAuth} from "./redux/users-selectors";

const {Content, Footer} = Layout;

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    initialiseApp: () => void
}

const App: React.FC<MapPropsType & DispatchPropsType> = (props) => {
    const isAuth = useSelector(getIsAuth);
    const messages = useSelector((state: AppStateType) => state.chat.messages)
    const dispatch = useDispatch();
    useEffect(() => {
        if (isAuth)
            dispatch(startMessagesListening());
        props.initialiseApp();
        return () => {
            if (isAuth)
                dispatch(stopMessagesListening());
        }
    }, [isAuth]);

    if (!props.initialised)
        return <Loading/>;

    return (
        <Layout>
            <Header/>
            <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
                <div className="site-layout-background" style={{padding: 24, minHeight: 380}}>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to={'/profile'}/>}/>
                        <Route path="/profile/:userId?" render={() => <ProfileContainer/>}/>
                        <Route path="/dialogs" render={() => <DialogsContainer/>}/>
                        <Route exact path="/users" render={() => <Users/>}/>
                        <Route exact path="/users?friends=true" render={() => <Users/>}/>
                        <Route path="/login" render={() => <Login/>}/>
                        <Route path="/chat" render={() => <ChatPage/>}/>
                        <Route path="*" render={() => <Result
                            status="404"
                            title="404"
                            subTitle="Sorry, the page you visited does not exist."
                            extra={<Button type="primary">Back Home</Button>}
                        />}/>
                    </Switch>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>VASILEK ©2021 Created by Grozer</Footer>
        </Layout>
    );
}

const mapStateToProps = (state: AppStateType) => ({
    initialised: state.app.Initialised
});

export default compose<React.ComponentType>(
    withRouter,
    connect(mapStateToProps, {initialiseApp}))(App);
