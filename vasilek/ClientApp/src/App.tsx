import React, {useEffect} from 'react';
import './App.css';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Login} from './components/Login/Login';
import {useDispatch, useSelector} from 'react-redux';
import {initialiseApp} from './redux/app-reducer';
import Loading from './components/common/Loading/Loading';
import {Users} from "./components/Users/Users";
import 'antd/dist/antd.css';
import {BackTop, Button, Layout, Result} from 'antd';
import {Header} from "./components/Header/Header";
import {ChatPage} from "./components/pages/Chat/ChatPage";
import {startMessagesListening, stopMessagesListening} from "./redux/chat-reducer";
import Profile from "./components/Profile/Profile";
import {s_getInitialised} from "./redux/app-selectors";
import Dialogs from "./components/Dialogs/Dialogs";
import {s_getIsAuth} from "./redux/auth-selectors";

const {Content, Footer} = Layout;

const App: React.FC = (props) => {
    const isAuth = useSelector(s_getIsAuth);
    const initialised = useSelector(s_getInitialised);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuth)
            dispatch(startMessagesListening());
        dispatch(initialiseApp());
        return () => {
            if (isAuth)
                dispatch(stopMessagesListening());
        }
    }, [isAuth]);

    const requireAuth = () => {
        if (!isAuth)
            return <Redirect to="/login"/>
    }

    if (!initialised)
        return <Loading/>;

    return (
        <Layout style={{backgroundColor:'white'}}>
            <Header/>
            <Content  className="site_layout">
                <Switch>
                    <ProtectedRoute exact path="/" component={Profile}/>
                    <Route path="/profile" component={Profile}/>
                    <ProtectedRoute path="/dialogs" component={Dialogs}/>
                    <Route exact path="/users" render={() => <Users/>}/>
                    <ProtectedRoute exact path="/users?friends=true" component={Users}/>
                    <Route path="/login" render={() => <Login/>}/>
                    <ProtectedRoute path="/chat" component={ChatPage}/>
                    <Route path="*" render={() => <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the page you visited does not exist."
                        extra={<Button type="primary">Back Home</Button>}
                    />}/>
                </Switch>
            </Content>
            <BackTop />
        </Layout>
    );
}

// @ts-ignore
const ProtectedRoute = ({path, component: Component, ...rest}) => {
    const isAuth = useSelector(s_getIsAuth);
    return (
        <Route
            path={path}
            {...rest}
            render={props => {
                if (isAuth)
                    return <Component {...props} />
                else
                    return <Redirect to="/login"/>
            }}
        />
    );
};

export default App;
