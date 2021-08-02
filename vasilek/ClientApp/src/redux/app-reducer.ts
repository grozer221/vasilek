import {getAuthUserData} from './auth-reducer';
import {InferActionsTypes} from "./redux-store";

let initialState = {
    initialised: false,
    formError: '',
    formSuccess: null as null | boolean,
    pageOpened: 'dialogs' as PageOpenedType,
};

type PageOpenedType = 'dialogs' | 'messages' | 'info'



const appReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch (action.type) {
        case 'INITIALISED_SUCCESS':
            return {
                ...state,
                initialised: true,
            };
        case 'SET_FORM_ERROR':
            return {
                ...state,
                formError: action.error
            };
        case 'SET_FORM_SUCCESS':
            return {
                ...state,
                formSuccess: action.success
            };
        case 'SET_PAGE_OPENED':
            return {
                ...state,
                pageOpened: action.pageOpened
            };
        default:
            return state;
    }
};

export const actions = {
    initialisedSuccess: () => ({type: 'INITIALISED_SUCCESS'} as const),
    setFormError: (error: string) => ({
        type: 'SET_FORM_ERROR',
        error: error
    } as const),
    setFormSuccess: (success: boolean | null) => ({
        type: 'SET_FORM_SUCCESS',
        success: success
    } as const),
    setPageOpened: (pageOpened: PageOpenedType) => ({
        type: 'SET_PAGE_OPENED',
        pageOpened: pageOpened
    } as const),
}

export const initialiseApp = () => (dispatch: any) => {
    let promise = dispatch(getAuthUserData());
    Promise.all([promise])
        .then(() => {
            dispatch(actions.initialisedSuccess());
        });
};

export default appReducer;

export type InitialStateType = typeof initialState;
type ActionsTypes = InferActionsTypes<typeof actions>