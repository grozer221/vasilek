import React from 'react';
import Post from './Post/Post';
import { Field, reduxForm } from 'redux-form';
import { maxLengthCreator, required } from '../../../utills/validators/validators';
import { Textarea } from '../../common/FormsControls/FormsControls';

const maxLength10 = maxLengthCreator(10);

const Posts = React.memo(props => {
  console.log('render');
  let onAddPost = (values) => {
    props.addPost(values.newPostText);
  };
  return (
    <div>
      <AddNewPostFormRedux onSubmit={onAddPost}/>
      <div>
        {props.posts.map(obj => <Post key={obj.id} message={obj.message} likesCount={obj.likesCount}/>)}
      </div>
    </div>
  );
});


let AddNewPostForm = (props) => {
   return(
     <form onSubmit={props.handleSubmit}>
       <Field component={Textarea} placeholder='Post message' name={'newPostText'} validate={[required, maxLength10]} />
       <div>
         <button>Додати</button>
       </div>
     </form>
   );
}

const AddNewPostFormRedux = reduxForm({form: 'ProfileAddNewPostForm'})(AddNewPostForm);


export default Posts;