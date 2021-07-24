import { AppStateType } from './redux-store';

export const s_getInitialised = (state: AppStateType) => {
  return state.app.initialised;
}

