import React, {useEffect} from 'react';
import s from './Profile.module.css';
import {ProfileInfo} from './ProfileInfo/ProfileInfo';
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentUserId, s_getIsAuth} from "../../redux/auth-selectors";
import {useHistory} from "react-router-dom";
import queryString from "querystring";
import {getUserProfile} from "../../redux/profile-reducer";

const Profile: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const currentUserId = useSelector(s_getCurrentUserId);
    const history = useHistory();
    let userId = useSelector(s_getCurrentUserId);
    const dispatch = useDispatch();

    useEffect(() => {
        const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType;
        if(parsed.id !== undefined)
            userId = parsed.id
        else if(isAuth)
            userId = currentUserId
        else
            history.push({pathname: '/login'});
        dispatch(getUserProfile(userId));
    }, [])

    return (
        <div>
            <ProfileInfo userId={userId} />
            {/*<PostsContainer/>*/}
        </div>
    );
}

type QueryParamsType = {
    id: number | undefined
}

export default Profile;
