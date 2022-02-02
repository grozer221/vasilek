import React, {FC} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {DrawerContentComponentProps, DrawerItem} from "@react-navigation/drawer";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/auth-reducer";
import {Icon} from "@ant-design/react-native";
import {s_getCurrentUser} from "../../redux/auth-selectors";
// @ts-ignore
import userWithoutPhoto from "../../assets/images/man.png";
import {urls} from "../../api/api";
import {SafeAreaView} from 'react-native-safe-area-context';

export const DrawerContent: FC<DrawerContentComponentProps> = (props) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(s_getCurrentUser);

    return (
        <SafeAreaView style={s.wrapper}>
            <View>
                <View style={[s.drawerItem, {marginVertical: 20}]}>
                    <Image style={s.ava}
                           source={currentUser?.avaPhoto ? {uri: urls.pathToUsersPhotos + currentUser.avaPhoto} : userWithoutPhoto}
                    />
                    <View>
                        <Text style={[s.text, s.nick]}>{currentUser?.nickName}</Text>
                        <Text style={[s.text, s.login]}>@{currentUser?.login}</Text>
                    </View>
                </View>
                <DrawerItem
                    icon={({color, size}) => (
                        <Icon
                            name={'message'}
                            color={color}
                            size={size}
                            style={s.text}
                        />
                    )}
                    label={'Dialogs'}
                    labelStyle={s.text}
                    onPress={() => props.navigation.navigate('Dialogs')}
                />
                <DrawerItem
                    icon={({color, size}) => (
                        <Icon
                            name={'user'}
                            color={color}
                            size={size}
                            style={s.text}
                        />
                    )}
                    label={'Users'}
                    labelStyle={s.text}
                    onPress={() => props.navigation.navigate('Users')}
                />
            </View>
            <View>
                <DrawerItem
                    icon={({color, size}) => (
                        <Icon
                            name={'setting'}
                            color={color}
                            size={size}
                            style={s.text}
                        />
                    )}
                    label={'Settings'}
                    labelStyle={s.text}
                    onPress={() => props.navigation.navigate('Settings')}
                />
                <DrawerItem
                    icon={({color, size}) => (
                        <Icon
                            name={'logout'}
                            color={color}
                            size={size}
                            style={s.text}
                        />
                    )}
                    label={'Logout'}
                    labelStyle={s.text}
                    onPress={() => dispatch(logout())}
                />
            </View>
        </SafeAreaView>
    )
}

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: '#1c1c1c',
    },
    drawerItem: {
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        padding: 5,
        flexDirection: 'row',
        alignItems: "center",
    },
    ava: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 50
    },
    nick: {
        fontWeight: "bold",
    },
    login: {
        color: 'grey',
    },
    text: {
        color: 'white',
    }
})
