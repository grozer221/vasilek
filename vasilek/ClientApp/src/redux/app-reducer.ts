import { getAuthUserData } from './auth-reducer';
import {InferActionsTypes} from "./redux-store";

let initialState = {
  Initialised: false,
  Login: null,
  Name: null,
  IsAuth: false
};

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>

const appReducer = (state = initialState, action: ActionsTypes) : InitialStateType => {
  switch (action.type) {
    case 'INITIALISED_SUCCESS':
      return {
        ...state,
        Initialised: true,
      };

    default:
      return state;
  }
};

export const actions = {
  initialisedSuccess : () => ({ type: 'INITIALISED_SUCCESS'} as const),
}

export const initialiseApp = () => (dispatch: any) => {
  let promise = dispatch(getAuthUserData());
  Promise.all([promise])
    .then(() => {
    dispatch(actions.initialisedSuccess());
  });
};

export default appReducer;