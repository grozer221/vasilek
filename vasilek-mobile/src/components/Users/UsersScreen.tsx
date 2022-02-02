import React, {FC, useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentPage, s_getPageSize, s_getTerm, s_getUsers, s_getUsersCount} from "../../redux/users-selectors";
import {actions, requestAndAddUsers, requestAndSetUsers} from "../../redux/users-reducer";
import {User} from "./User";

export const UsersScreen: FC = () => {
    const dispatch = useDispatch();
    const usersCount = useSelector(s_getUsersCount);
    const currentPage = useSelector(s_getCurrentPage);
    const pageSize = useSelector(s_getPageSize);
    const users = useSelector(s_getUsers);
    const term = useSelector(s_getTerm);

    useEffect(() => {
        dispatch(requestAndSetUsers(currentPage, pageSize, term));
        return () => {
            dispatch(actions.setCurrentPage(1))
        };
    }, []);


    useEffect(() => {
        if (users.length && users.length < usersCount)
            dispatch(requestAndAddUsers(currentPage, pageSize, term));
    }, [currentPage])

    useEffect(() => {
        dispatch(requestAndSetUsers(1, pageSize, term));
    }, [term])

    return (
        <View style={s.wrapper}>
            {users.map(user => <User key={user.id} user={user}/>)}
        </View>
    );
};

const s = StyleSheet.create({
    wrapper: {
        backgroundColor: 'black',
        flex: 1,
    },
    text: {
        color: 'white',
    },
})