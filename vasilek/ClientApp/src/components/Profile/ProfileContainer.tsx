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
                return;
            }
        }
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
                     Profile={this.props.Profile}
                     Status={this.props.Status}
                     updateStatus={this.props.updateStatus}
                     IsOwner={!this.props.match.params.userId}
                     savePhoto={this.props.savePhoto}/>
        );
    }
}

let mapStateToProps = (state: AppStateType) => ({
    Profile: state.profilePage.Profile,
    Status: state.profilePage.Status,
    authUserId: state.auth.UserId,
    isAuth: state.auth.IsAuth
});

export default compose<React.ComponentType>(
    connect(mapStateToProps, {getUserProfile, updateStatus, savePhoto, updateProfile}),
    withRouter
)(ProfileContainer);
