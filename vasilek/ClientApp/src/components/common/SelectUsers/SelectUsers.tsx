import {Button, Checkbox, Form, message} from 'antd';
import React, {useEffect} from 'react';
import s from './SelectUsers.module.css';
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentPage, s_getPageSize, s_getTerm, s_getUsers, s_getUsersCount} from "../../../redux/users-selectors";
import {actions, requestAndAddUsers, requestAndSetUsers} from "../../../redux/users-reducer";
import {UsersSearchForm} from "../../Info/Users/UsersSearchForm";
import {ProfileType} from "../../../types/types";
import Avatar from "antd/es/avatar/avatar";
import userWithoutPhoto from "../../../assets/images/man.png";
import {urls} from "../../../api/api";
import {s_getCurrentDialogInfoId} from "../../../redux/dialoginfo-selectors";
import {addUsersToDialog} from "../../../redux/dialoginfo-reducer";

type Props = {
    setIsOpenSelectUser: (flag: boolean) => void
}

export const SelectUsers: React.FC<Props> = ({setIsOpenSelectUser}) => {
    const usersCount = useSelector(s_getUsersCount);
    const currentDialogInfoId = useSelector(s_getCurrentDialogInfoId);
    const currentPage = useSelector(s_getCurrentPage);
    const pageSize = useSelector(s_getPageSize);
    const users = useSelector(s_getUsers);
    const term = useSelector(s_getTerm);
    const dispatch = useDispatch();

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


    const scrollHandler = (e: any) => {
        const element = e.currentTarget;
        if (Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight <= 0.5
            && users.length > 0
            && users.length < usersCount) {
            dispatch(actions.setCurrentPage(currentPage + 1));
        }
    };


    const onFinish = (values: any) => {
        let valuesKeys = Object.keys(values);
        let usersIdsToAdd: number[] = [];
        for (let i = 0; i < valuesKeys.length; i++)
            if (values[valuesKeys[i]])
                usersIdsToAdd.push(Number(valuesKeys[i]))
        dispatch(addUsersToDialog(currentDialogInfoId as number, usersIdsToAdd));
        setIsOpenSelectUser(false);
    }

    return (
        <div className={s.wrapper_select_users}>
            <UsersSearchForm/>
            <Form
                name="form_select_users"
                onFinish={onFinish}
                className={s.form_select_users}
            >
                <div className={s.select_users} onScroll={scrollHandler}>
                    {users.map(user => <SelectUser user={user} key={user.id}/>)}
                </div>
                <div className={s.buttons}>
                    <Button onClick={() => setIsOpenSelectUser(false)} htmlType={'button'}>Cancel</Button>
                    <Button htmlType={'submit'} type={'primary'}>Add</Button>
                </div>
            </Form>
        </div>
    );
}

type PropsType = {
    user: ProfileType
}

const SelectUser: React.FC<PropsType> = ({user}) => {
    return (
        <div className={s.select_user}>
            <Form.Item name={user.id} valuePropName={'checked'}>
                <Checkbox style={{alignItems: "center"}}>
                    <div className={s.content_checkbox_select_user}>
                        <Avatar src={user.avaPhoto ? urls.pathToUsersPhotos + user.avaPhoto : userWithoutPhoto}/>
                        <div>{user.nickName}</div>
                    </div>
                </Checkbox>
            </Form.Item>
        </div>
    );
}