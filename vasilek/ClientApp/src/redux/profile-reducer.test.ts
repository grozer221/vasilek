import profileReducer, {actions} from './profile-reducer';
import {PostType, ProfileType} from "../types/types";

let state = {
    posts: [
        {likesCount: 1, message: 'ааааа'},
        {likesCount: 2, message: 'ббббб'},
        {likesCount: 3, message: 'ввввв'}
    ] as Array<PostType>,
    profile: null as ProfileType | null,
    status: '',
    newPostText: ''
};

it('length of post should be incremented', () => {
    //1 test date
    let action = actions.addPostActionCreator('IT-')

    //2 action
    let newState = profileReducer(state, action);

    //3 expectation
    expect(newState.posts.length).toBe(4);
});

it('after deleting length of message should be decrement', () => {

    let action = actions.deletePost(1)

    let newState = profileReducer(state, action);

    expect(newState.posts.length).toBe(3);
});

