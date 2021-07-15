import React from 'react';
import {connect} from 'react-redux';
import {
    follow,
    requestUsers,
    unfollow,
    getFollowedUsers,
    getFriends,
    FilterFormType, actions
} from '../../redux/users-reducer';
import Users from './Users';
import Loading from '../common/Loading/Loading';
import {compose} from 'redux';
import {
    getCurrentPage,
    getFollowingInProgress,
    getIsFetching,
    getPageSize,
    getUsers,
    getUsersCount,
    getFollowedUsersSelector,
    getIsAuth, getUsersFilter
} from '../../redux/users-selectors';
import {ProfileType} from '../../types/types';
import {AppStateType} from '../../redux/redux-store';

type MapStatePropsType = {
    CurrentPage: number
    PageSize: number
    IsFetching: boolean
    UsersCount: number
    Users: Array<ProfileType>
    FollowingInProgress: Array<number>
    FollowedUsers: Array<number>
    IsAuth: boolean
    Term: string
}

type MapDispatchPropsType = {
    getUsers: (currentPage: number, pageSize: number, term: string, showFriends: boolean) => void
    follow: (userId: number) => void
    unfollow: (userId: number) => void
    getFollowedUsers: () => void
    getFriends: (currentPage: number, pageSize: number) => void
}

type OwnPropsType = {}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType;

class UsersContainer extends React.Component<PropsType> {
    componentDidMount() {
        let {PageSize, Term} = this.props;
        this.props.getUsers(1, PageSize, Term, false);
        this.props.getFollowedUsers();
    };

    onPageChanged = (pageNumber: number) => {
        const {PageSize, Term} = this.props;
        this.props.getUsers(pageNumber, PageSize, Term, false);
        this.props.getFollowedUsers();
    };

    onFilterChanged = (term: string) => {
        let {PageSize} = this.props;
        this.props.getUsers(1, PageSize, term, false);
    }

    render() {
        return (
            <>
                {this.props.IsFetching ? <Loading/> : null}
                <Users
                    usersCount={this.props.UsersCount}
                    pageSize={this.props.PageSize}
                    users={this.props.Users}
                    currentPage={this.props.CurrentPage}
                    onPageChanged={this.onPageChanged}
                    unfollow={this.props.unfollow}
                    follow={this.props.follow}
                    followingInProgress={this.props.FollowingInProgress}
                    getFollowedUsers={this.props.getFollowedUsers}
                    followedUsers={this.props.FollowedUsers}
                    isAuth={this.props.IsAuth}
                    onFilterChanged={this.onFilterChanged}
                />
            </>
        );
    }
}

let mapStateToProps = (state: AppStateType): MapStatePropsType => {
    return {
        Users: getUsers(state),
        PageSize: getPageSize(state),
        UsersCount: getUsersCount(state),
        CurrentPage: getCurrentPage(state),
        IsFetching: getIsFetching(state),
        FollowingInProgress: getFollowingInProgress(state),
        FollowedUsers: getFollowedUsersSelector(state),
        IsAuth: getIsAuth(state),
        Term: getUsersFilter(state),
    };
};


export default compose(
    connect<MapStatePropsType, MapDispatchPropsType, OwnPropsType, AppStateType>(
        mapStateToProps,
        {follow, unfollow, getUsers: requestUsers, getFriends, getFollowedUsers})
)(UsersContainer);