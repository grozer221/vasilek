import React from 'react';
import { connect } from 'react-redux';
import {
  follow,
  requestUsers,
    unfollow,
    getFollowedUsers
} from '../../redux/users-reducer';
import Users from './Users';
import Loading from '../common/Loading/Loading';
import { compose } from 'redux';
import {
  getCurrentPage,
  getFollowingInProgress,
  getIsFetching,
  getPageSize,
  getUsers,
  getUsersCount,
  getFollowedUsersSelector
} from '../../redux/users-selectors';
import { ProfileType } from '../../types/types';
import { AppStateType } from '../../redux/redux-store';

type MapStatePropsType = {
  currentPage: number
  pageSize: number
  isFetching: boolean
  usersCount: number
  users: Array<ProfileType>
  followingInProgress: Array<number>
  followedUsers: Array<number>
}

type MapDispatchPropsType = {
  getUsers: (currentPage: number, pageSize: number) => void
  follow: (userId: number, userLogin: string) => void
  unfollow: (userId: number, userLogin: string) => void
  getFollowedUsers:() => void
}

type OwnPropsType = {

}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType;

class UsersContainer extends React.Component<PropsType> {
  componentDidMount() {
    let { currentPage, pageSize } = this.props;
    this.props.getUsers(currentPage, pageSize);
  };

  onPageChanged = (pageNumber: number) => {
    const { pageSize } = this.props;
    this.props.getUsers(pageNumber, pageSize);
  };

  render() {
    return (
      <>
        {this.props.isFetching ? <Loading/> : null}
        <Users
                usersCount={this.props.usersCount}
                pageSize={this.props.pageSize}
                users={this.props.users}
                currentPage={this.props.currentPage}
                onPageChanged={this.onPageChanged}
                unfollow={this.props.unfollow}
                follow={this.props.follow}
                followingInProgress={this.props.followingInProgress}
                getFollowedUsers={this.props.getFollowedUsers}
                followedUsers={this.props.followedUsers}
        />
      </>
    );
  }
}

let mapStateToProps = (state: AppStateType): MapStatePropsType => {
  return {
    users: getUsers(state),
    pageSize: getPageSize(state),
    usersCount: getUsersCount(state),
    currentPage: getCurrentPage(state),
    isFetching: getIsFetching(state),
    followingInProgress: getFollowingInProgress(state),
    followedUsers: getFollowedUsersSelector(state)
  };
};


export default compose(
  connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStateType>(
    mapStateToProps,
      { follow, unfollow, getUsers: requestUsers, getFollowedUsers })
)(UsersContainer);