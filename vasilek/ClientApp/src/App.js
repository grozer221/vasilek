import React from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import DialogsContainer from './components/Dialogs/DialogsContainer';
import UsersContainer from './components/Users/UsersContainer';
import ProfileContainer from './components/Profile/ProfileContainer';
import HeaderContainer from './components/Header/HeaderContainer';
import Login from './components/Login/Login';
import { connect } from 'react-redux';
import { initialiseApp } from './redux/app-reducer.ts';
import Loading from './components/common/Loading/Loading';
import { compose } from 'redux';

class App extends React.Component {
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
            <Route exact path="/" render={() => <Redirect to={'/profile'}  />}/>
            <Route path="/profile/:userId?" render={() => <ProfileContainer store={this.props.store}/>}/>
            <Route path="/dialogs" render={() => <DialogsContainer store={this.props.store}/>}/>
            <Route path="/users" render={() => <UsersContainer/>}/>
            <Route path="/login" render={() => <Login/>}/>
            <Route path="*" render={() => <div>404 Not Found</div>}/>
          </Switch>
        </div>
        <Footer className="downFooter"/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  initialised: state.app.initialised
});

export default compose(
  withRouter,
  connect(mapStateToProps, { initialiseApp }))(App);
