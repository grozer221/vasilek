import React from 'react';
import Post from './Post/Post';
import {InjectedFormProps, reduxForm} from 'redux-form';
import {maxLengthCreator, required} from '../../../utills/validators/validators';
import {createField, GetStringKeys, Textarea} from '../../common/FormsControls/FormsControls';
import {PostType} from "../../../types/types";

const maxLength10 = maxLengthCreator(10);

type MapPropsType = {
    Posts: Array<PostType>
}

type MapDispatchType = {
    addPost: (newPostText: string) => void
}

const Posts: React.FC<MapPropsType & MapDispatchType> = props => {
    let onAddPost = (values: AddPostFormValuesType) => {
        props.addPost(values.newPostText);
    };
    return (
        <div>
            <AddNewPostFormRedux onSubmit={onAddPost}/>
            <div>
                {props.Posts.map(obj => <Post key={obj.Id} Message={obj.Message} LikesCount={obj.LikesCount}/>)}
            </div>
        </div>
    );
}

export type AddPostFormValuesType = {
    newPostText: string
}

export type AddPostFormValuesTypeKeys = GetStringKeys<AddPostFormValuesType>;

let AddNewPostForm: React.FC<InjectedFormProps<AddPostFormValuesType>> = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            {createField<AddPostFormValuesTypeKeys>("Post message", "newPostText", [required, maxLength10], Textarea)}
            <div>
                <button>Додати</button>
            </div>
        </form>
    );
}

const AddNewPostFormRedux = reduxForm<AddPostFormValuesType>({form: 'ProfileAddPost'})(AddNewPostForm);


export default React.memo(Posts);