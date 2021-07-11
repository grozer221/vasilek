import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { logout } from '../../redux/auth-reducer';

class HeaderContainer extends React.Component {
  render() {
    return <Header {...this.props} />
  }
}
const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  name: state.auth.name,

})
export default connect(mapStateToProps, {logout})(HeaderContainer);
