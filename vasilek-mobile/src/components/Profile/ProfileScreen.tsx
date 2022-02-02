import React, {FC, useEffect} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {s_getProfile} from "../../redux/profile-selectors";
import {ProfileType} from "../../types/types";
// @ts-ignore
import userWithoutPhoto from "../../assets/images/man.png";
import {urls} from "../../api/api";
import {actions} from "../../redux/profile-reducer";


export const ProfileScreen: FC = () => {
    const dispatch = useDispatch();
    const profile = useSelector(s_getProfile) as ProfileType;
    const lastTimeOnline = profile?.dateLastOnline.toString().substr(0, 10) + ' ' + profile?.dateLastOnline.toString().substr(11, 8);

    useEffect(() => {
        return () => {
            dispatch(actions.setUserProfile(null));
        }
    })

    return (
        <View style={s.wrapper}>
            <View style={s.mainInfo}>
                <Image style={s.ava}
                       source={profile?.avaPhoto ? {uri: urls.pathToUsersPhotos + profile.avaPhoto} : userWithoutPhoto}/>
                <Text style={[s.text, s.nick]}>{profile?.nickName}</Text>
                <Text style={[s.text]}>{profile?.isOnline
                    ? 'Online'
                    : 'Last online: ' + lastTimeOnline
                }</Text>
            </View>
            <View style={s.info}>
                <Text style={[s.text, s.nick]}>Info</Text>
                {profile?.status &&
                <View style={s.item}>
                    <Text style={[s.text]}>Status: </Text>
                    <Text style={[s.text, {color: 'grey'}]}>{profile.status}</Text>
                </View>
                }
                <View style={s.item}>
                    <Text style={[s.text]}>Login: </Text>
                    <Text style={[s.text, {color: 'grey'}]}>@{profile?.login}</Text>
                </View>
                {profile?.country &&
                <View style={s.item}>
                    <Text style={[s.text]}>Country: </Text>
                    <Text style={[s.text, {color: 'grey'}]}>{profile.country}</Text>
                </View>
                }
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: "center",
        backgroundColor: 'black',
    },
    text: {
        color: 'white',
    },
    ava: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 50,
    },
    mainInfo: {
        alignItems: "center",
        marginBottom: 20,
    },
    nick: {
        fontWeight: "bold",
        fontSize: 20,
        marginRight: 10,
        marginBottom: 5,
    },
    info: {
        flex: 1,
        alignItems: "flex-start",
        alignSelf: "stretch",
        padding: 20,
    },
    item: {
        flexDirection: "row",
        marginBottom: 5,
    }
})
