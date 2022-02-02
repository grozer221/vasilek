import React, {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ProfileType} from '../../types/types';
// @ts-ignore
import userWithoutPhoto from '../../assets/images/man.png';
import {urls} from '../../api/api';
import {Button, Icon} from '@ant-design/react-native';
import {useDispatch} from 'react-redux';
import {getDialogByUserId} from '../../redux/dialogs-reducer';
import {actions} from '../../redux/profile-reducer';


export const User: FC<{ user: ProfileType }> = ({user}) => {
    const dispatch = useDispatch();

    return (
        <TouchableOpacity style={s.wrapper} onPress={() => {
            dispatch(actions.setUserProfile(user));
        }}>
            <View style={s.userInfo}>
                <Image style={s.ava}
                       source={user.avaPhoto ? {uri: urls.pathToUsersPhotos + user.avaPhoto} : userWithoutPhoto}/>
                <View style={{justifyContent: 'space-around'}}>
                    <Text style={[s.text, {fontWeight: 'bold'}]}>{user.nickName}</Text>
                    <Text style={[s.text, {color: 'grey'}]}>@{user.login}</Text>
                </View>
            </View>
            <Button style={s.buttonWrite} onPress={() => {
                dispatch(getDialogByUserId(user.id));
            }}>
                <Icon name={'message'}/>
            </Button>
        </TouchableOpacity>
    );
};

const s = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
    },
    text: {
        color: 'white',
    },
    userInfo: {
        flexDirection: 'row',
    },
    ava: {
        width: 60,
        height: 60,
        marginRight: 10,
    },
    buttonWrite: {
        borderWidth: 0,
        backgroundColor: 'black',
    },
});
