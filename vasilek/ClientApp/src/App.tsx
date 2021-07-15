import React from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import {Route, withRouter, Switch, Redirect} from 'react-router-dom';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import UsersContainer from './components/Users/UsersContainer';
import ProfileContainer from './components/Profile/ProfileContainer';
import HeaderContainer from './components/Header/HeaderContainer';
import Login from './components/Login/Login';
import {connect} from 'react-redux';
import {initialiseApp} from './redux/app-reducer';
import Loading from './components/common/Loading/Loading';
import {compose} from 'redux';
import {AppStateType} from "./redux/redux-store";

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
            <div className="wrapper-app">
                <HeaderContainer/>
                <div className="content">
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to={'/profile'}/>}/>
                        <Route path="/profile/:userId?" render={() => <ProfileContainer/>}/>
                        <Route path="/dialogs" render={() => <DialogsContainer/>}/>
                        <Route path="/friends" render={() => <UsersContainer/>}/>
                        <Route path="/users" render={() => <UsersContainer/>}/>
                        <Route path="/login" render={() => <Login/>}/>
                        <Route path="*" render={() => <div>404 Not Found</div>}/>
                    </Switch>
                </div>
                <footer className="downFooter">
                    <Footer/>
                </footer>
            </div>
        );
    }
}

const mapStateToProps = (state: AppStateType) => ({
    initialised: state.app.Initialised
});

export default compose<React.ComponentType>(
    withRouter,
    connect(mapStateToProps, {initialiseApp}))(App);
