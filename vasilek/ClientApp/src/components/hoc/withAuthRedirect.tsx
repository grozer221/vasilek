import React from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {AppStateType} from "../../redux/redux-store";

let mapStateToPropsForRedirect = (state: AppStateType) => ({
    isAuth: state.auth.IsAuth,
});

type MapPropsType = {
    isAuth: boolean
}

export function withAuthRedirect<WCP>(WrappedComponent: React.ComponentType<WCP>) {
    const RedirectComponent: React.FC<MapPropsType> = (props) => {
        let {isAuth, ...restProps} = props;
        if (!props.isAuth)
            return <Redirect to={'/login'}/>;

        return <WrappedComponent {...restProps as unknown as WCP}/>;
    }

    return connect<MapPropsType, {}, WCP, AppStateType>(mapStateToPropsForRedirect)(RedirectComponent);
};