import React from 'react';
import './App.css';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import ProfileContainer from './components/Profile/ProfileContainer';
import {Login} from './components/Login/Login';
import {connect} from 'react-redux';
import {initialiseApp} from './redux/app-reducer';
import Loading from './components/common/Loading/Loading';
import {compose} from 'redux';
import {AppStateType} from "./redux/redux-store";
import {Users} from "./components/Users/Users";
import 'antd/dist/antd.css';
import {Breadcrumb, Layout} from 'antd';
import {Header} from "./components/Header/Header";

const {Content, Footer} = Layout;

type MapPropsType = ReturnType<typeof mapStateToProps>;
type DispatchPropsType = {
    initialiseApp: () => void
}

class App extends React.Component<MapPropsType & DispatchPropsType> {
    componentDidMount() {
        this.props.initialiseApp();
    }

    render() {
        if (!this.props.initialised)
            return <Loading/>;
        return (
            <Layout>
                <Header/>
                <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 380}}>
                        <Switch>
                            <Route exact path="/" render={() => <Redirect to={'/profile'}/>}/>
                            <Route path="/profile/:userId?" render={() => <ProfileContainer/>}/>
                            <Route path="/dialogs" render={() => <DialogsContainer/>}/>
                            <Route exact path="/users?friends=true" render={() => <Users/>}/>
                            <Route exact path="/users" render={() => <Users/>}/>
                            <Route path="/login" render={() => <Login/>}/>
                            <Route path="*" render={() => <div>404 Not Found</div>}/>
                        </Switch>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>VASILEK ©2021 Created by Grozer</Footer>
            </Layout>
        );
    }
}

const mapStateToProps = (state: AppStateType) => ({
    initialised: state.app.Initialised
});

export default compose<React.ComponentType>(
    withRouter,
    connect(mapStateToProps, {initialiseApp}))(App);
