import React from 'react';
import s from './Users.module.css';
import Paginator from '../common/Paginator/Paginator';
import User from './User';
import {ProfileType} from '../../types/types';
import {UsersSearchForm} from "./UsersSearchForm";
import {FilterFormType} from "../../redux/users-reducer";

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
    onFilterChanged: (filter: FilterFormType) => void
}

type MapDispatchPropsType = {
    follow: (userId: number) => void
    unfollow: (userId: number) => void
    getFollowedUsers: () => void
}

type OwnPropsType = {}

type PropsType = MapStatePropsType & MapDispatchPropsType & OwnPropsType;

class Users extends React.Component<PropsType> {
    render() {
        return (
            <div className={s.wrapper}>
                <UsersSearchForm onFilterChanged={this.props.onFilterChanged}/>
                <div className={s.wrapper_users}>
                    {this.props.users.map(obj =>
                        <User User={obj}
                              key={obj.Id}
                              FollowingInProgress={this.props.followingInProgress}
                              follow={this.props.follow}
                              unfollow={this.props.unfollow}
                              FollowedUsers={this.props.followedUsers}
                              IsAuth={this.props.isAuth}
                        />
                    )}
                </div>
                <Paginator currentPage={this.props.currentPage} onPageChanged={this.props.onPageChanged}
                           itemsCount={this.props.usersCount} pageSize={this.props.pageSize}/>
            </div>
        );
    }
};

export default Users;