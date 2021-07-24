import React from 'react';
import {actions} from '../../../redux/profile-reducer';
import Posts from './Posts';
import {connect} from 'react-redux';
import {AppStateType} from "../../../redux/redux-store";
import {PostType} from "../../../types/types";

type MapStatePropsType = {
    posts: Array<PostType>
}
const mapStateToProps = (state: AppStateType): MapStatePropsType => {
    return {
        posts: state.profilePage.posts,
    };
};

type MapDispatchPropsType = {
    addPost: (newPostText: string) => void
}

const mapDispatchToProps = (dispatch: any): MapDispatchPropsType => {
    return {
        addPost: (newPostText) => {
            dispatch(actions.addPostActionCreator(newPostText));
        }
    };
};

const PostsContainer = connect<MapStatePropsType, MapDispatchPropsType, {}, AppStateType>(mapStateToProps, mapDispatchToProps)(Posts);

export default PostsContainer;