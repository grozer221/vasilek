import { act } from '@testing-library/react';
import profileReducer from './profile-reducer';
import dialogsReducer from './dialogs-reducer';
import sidebarReducer from './sidebar-reducer';

let store = {
  _callSubscriber(){ },
  _state: {
    dialogsPage: {
      dialogs : [
        {id: 1, name: 'Grozer'},
        {id: 2, name: 'Prozer'},
        {id: 3, name: 'Zhozer'},
        {id: 4, name: 'Lozer'}
      ],
      messages : [
        {id: 1, message: 'fffffff'},
        {id: 2, message: 'asrgrea'},
        {id: 3, message: 'ffffbbbbfagff'},
      ],
      newMessageBody: ''
    },
    profilePage: {
      posts: [
        {likesCount: 1, message: 'ааааа'},
        {likesCount: 2, message: 'ббббб'},
        {likesCount: 3, message: 'ввввв'},
      ],
      newPostText: ''
    },
    sidebar: ''
  },
  getState(){
    return this._state;
  },
  subscribe(observer) {
    this._callSubscriber = observer;
  },
  dispatch(action){
    this._state.profilePage = profileReducer(this._state.profilePage, action);
    this._state.dialogsPage = dialogsReducer(this._state.dialogsPage, action);
    this._state.sidebar = sidebarReducer(this._state.sidebar, action);
    this._callSubscriber(this._state);
  }
}





export default store;