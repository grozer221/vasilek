import { getAuthUserData } from './auth-reducer';

const INITIALISED_SUCCESS = 'INITIALISED_SUCCESS';

export type InitialStateType = {
  initialised: boolean,
  login: string | null,
  name: string | null,
  isAuth: boolean
}

let initialState : InitialStateType = {
  initialised: false,
  login: null,
  name: null,
  isAuth: false
};

const appReducer = (state = initialState, action: any) : InitialStateType => {
  switch (action.type) {
    case INITIALISED_SUCCESS:
      return {
        ...state,
        initialised: true,
      };

    default:
      return state;
  }
};

type InitialisedSuccessActionType = {
  type: typeof INITIALISED_SUCCESS
}

export const initialisedSuccess = () : InitialisedSuccessActionType => ({ type: INITIALISED_SUCCESS});

export const initialiseApp = () => (dispatch: any) => {
  let promise = dispatch(getAuthUserData());
  Promise.all([promise])
    .then(() => {
    dispatch(initialisedSuccess());
  });
};

export default appReducer;