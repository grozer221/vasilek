import React, {FC, useState} from "react";
import {StyleSheet, View, Image, Text, ScrollView} from "react-native";
// @ts-ignore
import userWithoutPhoto from "../../assets/images/man.png";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentUser} from "../../redux/auth-selectors";
import {Button, InputItem, SegmentedControl} from "@ant-design/react-native";
import {urls} from "../../api/api";
import {updateProfile} from "../../redux/auth-reducer";
import {ProfileType} from "../../types/types";

type Tabs = 'Profile settings' | 'Change password';

export const SettingsScreen: FC = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(s_getCurrentUser);
    const [selectedTab, setSelectedTab] = useState('Profile settings' as Tabs);

    const [nick, setNick] = useState(currentUser.nickName)
    const [login, setLogin] = useState(currentUser.login)
    const [status, setStatus] = useState(currentUser.status)
    const [country, setCountry] = useState(currentUser.country)

    return (
        <View style={s.wrapper}>
            <SegmentedControl
                values={['Profile settings', 'Change password']}
                onValueChange={(value) => setSelectedTab(value as Tabs)}
            />
            {selectedTab === 'Profile settings' &&
            <ScrollView style={{width: '100%'}}>
                    <Image style={s.ava}
                           source={currentUser.avaPhoto ? {uri: urls.pathToUsersPhotos + currentUser.avaPhoto} : userWithoutPhoto}/>
                <View style={s.item}>
                    <Text style={[s.text, s.mgLeftAndTop]}>NickName: </Text>
                    <InputItem
                        style={s.text}
                        value={nick}
                        onChangeText={setNick}
                    />
                </View>
                <View style={s.item}>
                    <Text style={[s.text, s.mgLeftAndTop]}>Status: </Text>
                    <InputItem
                        style={s.text}
                        value={status}
                        onChangeText={setStatus}
                    />
                </View>
                <View style={s.item}>
                    <Text style={[s.text, s.mgLeftAndTop]}>Country: </Text>
                    <InputItem
                        style={s.text}
                        value={country}
                        onChangeText={setCountry}
                    />
                </View>
                <Button type={"ghost"}
                        style={{alignSelf: "stretch", marginTop: 20}}
                        onPress={() => dispatch(updateProfile({nickName: nick, login: login, status: status, country: country} as ProfileType))}
                >Save</Button>
            </ScrollView>
            }

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
        marginVertical: 20,
    },
    nick: {
        fontWeight: "bold",
        fontSize: 20,
        marginRight: 10,
        marginBottom: 5,
    },
    info: {
        flex: 1,
        alignSelf: "stretch",
    },
    item: {
        //flexDirection: "row",
        marginBottom: 5,
    },
    mgLeftAndTop: {
        marginLeft: 15,
        marginTop: 15,
        marginBottom: -10,
    }
})
