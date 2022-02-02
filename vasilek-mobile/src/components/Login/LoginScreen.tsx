import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {actions as authActions, login as loginFunction} from '../../redux/auth-reducer';
import {s_getIsFetching} from '../../redux/auth-selectors';
import {s_getFormError, s_getFormSuccess} from '../../redux/app-selectors';
import {actions} from '../../redux/app-reducer';
import {Button, InputItem} from '@ant-design/react-native';

export const LoginScreen: FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [passError, setPassError] = useState(false);
    const isFetching = useSelector(s_getIsFetching);
    const formSuccess = useSelector(s_getFormSuccess);
    const formError = useSelector(s_getFormError);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(authActions.setIsFetching(false));
        };
    });

    return (
        <View style={s.wrapper}>
            <View style={s.wrapperControl}>
                <InputItem
                    clear
                    style={s.text}
                    value={login}
                    onChange={value => {
                        if (value.trim() === '')
                            setLoginError(true);
                        else
                            setLoginError(false);
                        dispatch(actions.setFormError(''));
                        dispatch(actions.setFormSuccess(null));
                        setLogin(value);
                    }}
                    placeholder="Login"
                    placeholderTextColor={'grey'}
                    error={loginError}

                />
            </View>
            <View style={s.wrapperControl}>
                <InputItem
                    clear
                    style={s.text}
                    value={password}
                    onChange={value => {
                        if (value.trim() === '')
                            setPassError(true);
                        else
                            setPassError(false);
                        dispatch(actions.setFormError(''));
                        dispatch(actions.setFormSuccess(null));
                        setPassword(value);
                    }}
                    placeholder="Password"
                    placeholderTextColor={'grey'}
                    type={'password'}
                    error={passError}
                />
            </View>
            {formSuccess === false ? <Text style={s.error}>{formError}</Text> : null}
            <View style={s.wrapperControl}>
                <Button
                    loading={isFetching}
                    onPress={() => dispatch(loginFunction(login, password))}
                    disabled={loginError || passError || login.trim() === '' || password.trim() === ''}
                >
                    Login
                </Button>
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    text: {
        color: 'white',
    },
    wrapper: {
        width: '100%',
        // borderWidth: 1,
        // borderStyle: "solid",
        // borderColor: 'white',
    },
    input: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
        fontSize: 18,
        color: 'white',
    },
    wrapperControl: {
        marginVertical: 15,
    },
    error: {
        color: 'red',
        marginVertical: 5,
    },
});
