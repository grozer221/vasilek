import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {LoginScreen} from './src/components/Login/LoginScreen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './src/redux/redux-store';
import {s_getIsAuth} from './src/redux/auth-selectors';
import {DialogsScreen} from './src/components/Dialogs/DialogsScreen';
import {initialiseApp} from './src/redux/app-reducer';
import {s_getInitialised} from './src/redux/app-selectors';
import {Loading} from './src/components/common/Loading/Loading';
import {startDialogsListening, stopDialogsListening} from './src/redux/dialogs-reducer';
import {MessagesScreen} from './src/components/Messages/MessagesScreen';
import {SettingsScreen} from './src/components/Settings/SettingsScreen';
import {Button, Icon, Provider as AntProvider} from '@ant-design/react-native';
import * as Font from 'expo-font';
import {DrawerContent} from './src/components/DrawerContent/DrawerContent';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {s_getCurrentDialogId, s_getDialogs} from './src/redux/dialogs-selectors';
import {DialogType} from './src/api/dialogs-api';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {UsersScreen} from './src/components/Users/UsersScreen';
import {s_getProfile} from './src/redux/profile-selectors';
import {ProfileScreen} from './src/components/Profile/ProfileScreen';

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <AntProvider>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <AppWithStore/>
                    </NavigationContainer>
                </SafeAreaProvider>
            </AntProvider>
        </Provider>

    );
};

const AppWithStore = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(s_getIsAuth);
    const initialised = useSelector(s_getInitialised);
    const navigation = useNavigation();
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const dialogs = useSelector(s_getDialogs);
    const profile = useSelector(s_getProfile);
    const currentDialog = dialogs.find(dialog => dialog.id === currentDialogId) as DialogType;

    useEffect(() => {
        (async () => {
            await Font.loadAsync(
                'antoutline',
                // eslint-disable-next-line
                require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
            );

            await Font.loadAsync(
                'antfill',
                // eslint-disable-next-line
                require('@ant-design/icons-react-native/fonts/antfill.ttf'),
            );
            if (isAuth)
                dispatch(startDialogsListening());
            dispatch(initialiseApp());
            return () => {
                if (isAuth)
                    dispatch(stopDialogsListening());
            };
        })();
    }, [isAuth]);

    useEffect(() => {
        if (currentDialogId !== null)
            // @ts-ignore
            navigation.navigate('Messages');
    }, [currentDialogId]);

    useEffect(() => {
        if (profile !== null)
            // @ts-ignore
            navigation.navigate('Profile');
    }, [profile]);

    if (!initialised)
        return (
            <View style={s.wrapperCenter}>
                <Loading/>
            </View>

        );

    if (!isAuth)
        return (
            <View style={s.wrapperCenter}>
                <LoginScreen/>
            </View>
        );


    const headerWithStepBack = {
        headerLeft: () => (
            <Button
                onPress={() => navigation.goBack()}
                style={{backgroundColor: 'black', borderWidth: 0}}
            >
                <Icon name={'arrow-left'} style={{color: 'white'}}/>
            </Button>
        ),
        headerStyle: {backgroundColor: 'black'},
        headerTintColor: 'white',
    };

    return (
        <View style={s.wrapper}>
            <Drawer.Navigator
                initialRouteName="Dialogs"
                drawerContent={props => <DrawerContent navigation={props.navigation} descriptors={props.descriptors}
                                                       state={props.state}/>}
            >
                <Drawer.Screen name="Dialogs" component={DialogsScreen} options={{
                    headerTintColor: 'white',
                    headerStyle: {backgroundColor: 'black'},
                }}/>
                <Drawer.Screen name="Messages" component={MessagesScreen}
                               options={Object.assign(headerWithStepBack, {headerTitle: currentDialog?.dialogName})}/>
                <Drawer.Screen name="Users" component={UsersScreen} options={headerWithStepBack}/>
                <Drawer.Screen name="Profile" component={ProfileScreen} options={headerWithStepBack}/>
                <Drawer.Screen name="Settings" component={SettingsScreen} options={headerWithStepBack}/>
            </Drawer.Navigator>
        </View>
    );
};

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'black',
        color: 'white',
    },
    wrapperCenter: {
        flex: 1,
        width: '100%',
        backgroundColor: 'black',
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    text: {
        color: 'white',
    },
});
