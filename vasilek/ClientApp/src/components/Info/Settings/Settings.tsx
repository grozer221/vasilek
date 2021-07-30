import React, {ChangeEvent, useEffect} from 'react';
import s from './Settings.module.css';
import {Avatar, Button, Carousel, Form, Input, message, Modal} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentUser} from "../../../redux/auth-selectors";
import userWithoutPhoto from "../../../assets/images/man.png";
import {urls} from "../../../api/api";
import {DeleteOutlined, ExclamationCircleOutlined, StarFilled, StarOutlined, UploadOutlined} from "@ant-design/icons";
import {
    addPhotoForUser,
    changePassword,
    deletePhotoFromUser,
    setAvaPhotoForUser,
    updateProfile
} from "../../../redux/auth-reducer";
import {PhotoType, ProfileType} from "../../../types/types";
import {Link, Route, useHistory} from 'react-router-dom';
import {actions as appActions} from '../../../redux/app-reducer';
import {s_getFormError, s_getFormSuccess} from "../../../redux/app-selectors";


const {confirm} = Modal;


export const Settings: React.FC = () => {
    return (
        <div className={s.wrapper_settings}>
            <Route exact path={'/settings'} component={SettingProfile}/>
            <Route exact path={'/settings/changepass'} component={ChangePass}/>
        </div>
    );
};

export type ChangePassType = { oldPassword: string, password: string, confirmPassword: string }

const ChangePass: React.FC = () => {
    const formError = useSelector(s_getFormError);
    const formSuccess = useSelector(s_getFormSuccess);
    const history = useHistory();
    const dispatch = useDispatch();
    const onFinish = (changePass: ChangePassType) => {
        dispatch(appActions.setFormError(''));
        dispatch(changePassword(changePass));
    };

    useEffect(() => {
        if (formSuccess) {
            history.push('/settings')
            message.success('You successfully changed password');
            dispatch(appActions.setFormSuccess(null));
            dispatch(appActions.setFormError(''));
        }
    }, [formSuccess])

    return (
        <div className={s.wrapper_form_change_pass}>
            <Form
                name="edit_profile_form"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={onFinish}
                className={s.form_change_password}
            >
                <Form.Item
                    name="oldPassword"
                    label="Old pass"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your old pass!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password onChange={() => dispatch(appActions.setFormError(''))}/>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="New pass"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your pass!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password onChange={() => dispatch(appActions.setFormError(''))}/>
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm pass"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your pass!',
                        },
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password onChange={() => dispatch(appActions.setFormError(''))}/>
                </Form.Item>
                <div className={s.form_error}>{formError}</div>
                <Form.Item
                    style={{display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center"}}>
                    <Button type="primary" htmlType="submit">
                        Change
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const SettingProfile: React.FC = () => {
    const currentUser = useSelector(s_getCurrentUser);
    const dispatch = useDispatch();

    const onFinish = (values: ProfileType) => {
        dispatch(updateProfile(values));
    };
    const showConfirm = (photoName: string) => {
        confirm({
            title: 'Do you want to delete photo?',
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                dispatch(deletePhotoFromUser(photoName))
            },
        });
    }

    const photoChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            dispatch(addPhotoForUser(e.target.files[0]));
        }
    };

    return (
        <div className={s.wrapper_form_edit}>
            <div className={s.photo_edit}>
                <Carousel style={{width: '200px'}}>
                    {currentUser.photos.length > 0
                        ? currentUser.photos.map(p =>
                            <div key={p.id} className={s.wrapper_photo}>
                                <div className={s.buttons}>
                                    <button className={s.button_icon_delete}
                                            onClick={() => showConfirm(p.photoName)}
                                    >
                                        <Avatar className={s.icon_delete} size={32} icon={<DeleteOutlined/>}/>
                                    </button>
                                    {p.photoName === currentUser.avaPhoto
                                        ? <button className={s.button_icon_set_ava}
                                                  onClick={() => dispatch(setAvaPhotoForUser({photoName: ''} as PhotoType))}>
                                            <Avatar className={s.icon_set_ava} size={32} icon={<StarFilled/>}/>
                                        </button>
                                        : <button className={s.button_icon_set_ava}
                                                  onClick={() => dispatch(setAvaPhotoForUser(p))}>
                                            <Avatar className={s.icon_set_ava} size={32} icon={<StarOutlined/>}/>
                                        </button>
                                    }
                                </div>
                                <Avatar size={200} src={urls.pathToUsersPhotos + p.photoName}/>
                            </div>
                        )
                        : <div className={s.wrapper_photo}>
                            <Avatar size={200} src={userWithoutPhoto}/>
                        </div>}
                </Carousel>

                <div className={s.wrapper_photo_upload}>
                    <input type="file" name="file" id="file" className={s.input_file} onChange={photoChangeHandler}/>
                    <label htmlFor="file" className={s.btn_tertiary}>

                    </label>
                    <button className={s.js_fileName}>
                        <Avatar icon={<UploadOutlined/>}/>
                    </button>
                </div>
            </div>

            <Form
                name="edit_profile_form"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                initialValues={{
                    login: currentUser.login,
                    nickName: currentUser.nickName,
                    status: currentUser.status,
                    country: currentUser.country,
                }}
                onFinish={onFinish}
                className={s.form_edit_data}
            >
                <Form.Item
                    label="Login"
                    name="login"
                    rules={[{required: true, message: 'Please input your login!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="NickName"
                    name="nickName"
                    rules={[{required: true, message: 'Please input your nickName!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Status"
                    name="status"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Country"
                    name="country"
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    style={{display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center"}}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
            <div className={s.button_change_pass}>
                <Link to='/settings/changepass'>
                    <Button>Change password</Button>
                </Link>
            </div>
        </div>
    );
}