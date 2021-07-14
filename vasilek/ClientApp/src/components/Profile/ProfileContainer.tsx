import React from 'react';
import Profile from './Profile';
import {connect} from 'react-redux';
import {getUserProfile, savePhoto, updateProfile, updateStatus} from '../../redux/profile-reducer';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {AppStateType} from "../../redux/redux-store";
import {ProfileType} from "../../types/types";

type MapPropsType = ReturnType<typeof mapStateToProps>;

type MapDispatchToProps = {
    getUserProfile: (userId: number | null) => ProfileType
    updateStatus: (newStatus: string) => void
    savePhoto: (file: File) => void
    updateProfile: (profile: ProfileType) => void
}

type PathParamsType = {
    userId: string
};

type PropsType = MapPropsType & MapDispatchToProps & RouteComponentProps<PathParamsType>;

class ProfileContainer extends React.Component<PropsType, MapDispatchToProps> {
    refreshProfile() {
        let userId: number | null = +this.props.match.params.userId;
        if (!userId) {
            userId = this.props.authUserId;
            if (!userId) {
                this.props.history.push('/login');
            }
        }
        if(!userId)
            throw new Error("ID should exist in URI or in state");
        this.props.getUserProfile(userId);
    }

    componentDidMount() {
        this.refreshProfile();
    }

    componentDidUpdate(prevProps: PropsType, prevState: PropsType) {
        if (this.props.match.params.userId != prevProps.match.params.userId)
            this.refreshProfile();
    }

    render() {
        return (
            <Profile {...this.props}
                     profile={this.props.profile}
                     status={this.props.status}
                     updateStatus={this.props.updateStatus}
                     isOwner={!this.props.match.params.userId}
                     savePhoto={this.props.savePhoto}/>
        );
    }
}

let mapStateToProps = (state: AppStateType) => ({
    profile: state.profilePage.profile,
    status: state.profilePage.status,
    authUserId: state.auth.userId,
    isAuth: state.auth.isAuth
});

export default compose<React.ComponentType>(
    connect(mapStateToProps, {getUserProfile, updateStatus, savePhoto, updateProfile}),
    withRouter
)(ProfileContainer);
