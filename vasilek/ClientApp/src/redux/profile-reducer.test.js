import profileReducer, { addPostActionCreator, deletePost } from './profile-reducer';

let state = {
  posts: [
    { likesCount: 1, message: 'ааааа' },
    { likesCount: 2, message: 'ббббб' },
    { likesCount: 3, message: 'ввввв' }
  ],
};

it('length of post should be incremented', () => {
  //1 test date
  let action = addPostActionCreator('IT-')

  //2 action
  let newState = profileReducer(state, action);

  //3 expectation
  expect(newState.posts.length).toBe(4);
});

it('after deleting length of message should be decrement', () => {

  let action = deletePost(1)

  let newState = profileReducer(state, action);

  expect(newState.posts.length).toBe(3);
});

