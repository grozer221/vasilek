import React from 'react';
import s from './Users.module.css';
import Paginator from '../common/Paginator/Paginator';
import User from './User';
import { ProfileType } from '../../types/types';

type MapStatePropsType = {
    usersCount: number
    pageSize: number
    currentPage: number
    onPageChanged: (pageNumber: number) => void
    portionSize?: number
    users: Array<ProfileType>
    followingInProgress: Array<number>
    followedUsers: Array<number>
    isAuth: boolean
}

type MapDispatchPropsType = {
    follow: (userId: number) => void
    unfollow: (userId: number) => void
    getFollowedUsers: () => void
}

type OwnPropsType = {

}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType;

class Users extends React.Component<PropsType> {
    componentDidMount() {
        this.props.getFollowedUsers();
    };

    render() {
        return (
            <div className={s.wrapper} >
                <div className={s.wrapper_users}>
                    {this.props.users.map(obj =>
                        <User user={obj}
                            key={obj.id}
                            followingInProgress={this.props.followingInProgress}
                            follow={this.props.follow}
                            unfollow={this.props.unfollow}
                            followedUsers={this.props.followedUsers}
                            isAuth={this.props.isAuth}
                        />
                    )}
                </div>
                <Paginator currentPage={this.props.currentPage} onPageChanged={this.props.onPageChanged} itemsCount={this.props.usersCount} pageSize={this.props.pageSize} />
            </div>
        );
    }
};

export default Users;