import React, {useState} from 'react';
import s from './DialogInfo.module.css';
import {s_getCurrentDialogInfoId} from "../../../redux/dialoginfo-selectors";
import {useDispatch, useSelector} from "react-redux";
import {s_getDialogs} from "../../../redux/dialogs-selectors";
import {Avatar, Form, Input, Modal} from "antd";
import {urls} from "../../../api/api";
import userWithoutPhoto from '../../../assets/images/man.png';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, StarFilled, UserAddOutlined} from "@ant-design/icons";
import {Link, Redirect} from 'react-router-dom';
import {SelectUsers} from "../../common/SelectUsers/SelectUsers";
import {s_getCurrentUser} from "../../../redux/auth-selectors";
import {changeGroupName, deleteUsersFromDialog} from "../../../redux/dialogs-reducer";
import {OnlineIndicator} from "../../common/OnlineIndicator/OnlineIndicator";

const {confirm} = Modal;

export const DialogInfo: React.FC = () => {
    const currentDialogInfoId = useSelector(s_getCurrentDialogInfoId);
    const currentUser = useSelector(s_getCurrentUser);
    const dialogs = useSelector(s_getDialogs);
    const currentDialogInfo = useSelector(s_getDialogs).filter(d => d.id === currentDialogInfoId)[0];
    const dispatch = useDispatch();
    const [isOpenSelectUser, setIsOpenSelectUser] = useState(false);
    const [isOnEditGroupNameMode, setIsOnEditGroupNameMode] = useState(false);

    const showConfirm = (userId: number, userLogin: string, dialogId: number, dialogName: string) => {
        confirm({
            title: <div>Do you want to delete <strong>{userLogin}</strong> from
                dialog-group <strong>{dialogName}</strong>?</div>,
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                dispatch(deleteUsersFromDialog(dialogId, userId))
            },
        });
    }

    const onFinish = (values: { group_name: string }) => {
        if (currentDialogInfo.dialogName !== values.group_name)
            dispatch(changeGroupName(currentDialogInfo.id, values.group_name));
        setIsOnEditGroupNameMode(false)
    }

    if (!currentDialogInfoId || dialogs.find(d => d.id === currentDialogInfoId) === undefined)
        return <Redirect to={'/'}/>

    return (
        <div className={s.wrapper_dialog_info}>
            <div className={s.ava}>
                <Avatar size={200}
                        src={currentDialogInfo.dialogPhoto ? urls.pathToUsersPhotos + currentDialogInfo.dialogPhoto : userWithoutPhoto}/>
            </div>
            <div className={s.name}>
                <h3>
                    {currentDialogInfo.isDialogBetween2
                        ? currentDialogInfo.dialogName
                        : isOnEditGroupNameMode
                            ? <Form
                                name="change_group_name"
                                initialValues={{group_name: currentDialogInfo.dialogName}}
                                onFinish={onFinish}
                                className={s.form_change_group_name}
                            >
                                <Form.Item
                                    name="group_name"
                                    rules={[{required: true, message: 'Please input your group name!'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item>
                                    <button type="submit">
                                        <Avatar icon={<EditOutlined/>}/>
                                    </button>
                                </Form.Item>
                            </Form>
                            : <>
                                {currentDialogInfo.dialogName}
                                <button onClick={() => setIsOnEditGroupNameMode(true)}>
                                    <Avatar icon={<EditOutlined/>}/>
                                </button>
                            </>
                    }
                </h3>

            </div>
            <div className={s.members_and_users}>
                <div className={s.members}>
                    <div>{currentDialogInfo.users.length} members</div>
                    <button onClick={() => setIsOpenSelectUser(!isOpenSelectUser)}>
                        <Avatar icon={<UserAddOutlined/>}/>
                    </button>
                </div>
                <div className={s.wrapper_users}>
                    {currentDialogInfo.users.map(user =>
                        <div className={s.user} key={user.id}>
                            <Link to={'/profile?id=' + user.id} key={user.id}>
                                <div className={s.user_info}>
                                    <div className={s.user_ava}>
                                        <Avatar
                                            src={user.avaPhoto ? urls.pathToUsersPhotos + user.avaPhoto : userWithoutPhoto}/>
                                        {user.isOnline &&
                                        <OnlineIndicator backgroundColor={'white'} width='15px' height='15px'
                                                         bottom='-2px' left='23px'/>}
                                    </div>
                                    <div className={s.name_and_who_is_author}>
                                        <div>{user.nickName}</div>
                                        {user.id === currentDialogInfo.authorId &&
                                        <Avatar size={16} icon={<StarFilled/>}/>}
                                    </div>
                                </div>
                            </Link>
                            {currentUser.id === currentDialogInfo.authorId
                            && user.id !== currentUser.id
                            && !currentDialogInfo.isDialogBetween2
                            && <button
                                onClick={() => showConfirm(user.id, user.login, currentDialogInfo.id, currentDialogInfo.dialogName)}>
                                <Avatar src={<DeleteOutlined/>}/>
                            </button>
                            }
                        </div>
                    )}
                </div>
            </div>
            {isOpenSelectUser && <SelectUsers setIsOpenSelectUser={setIsOpenSelectUser}/>}
        </div>
    );
};
