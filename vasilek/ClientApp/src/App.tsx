import React, {useEffect, useState} from 'react';
import './App.css';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import {Login} from './components/Login/Login';
import {useDispatch, useSelector} from 'react-redux';
import {actions, initialiseApp} from './redux/app-reducer';
import Loading from './components/common/Loading/Loading';
import 'antd/dist/antd.css';
import {s_getInitialised, s_getNewMessageReceived, s_getPageOpened} from "./redux/app-selectors";
import {s_getIsAuth} from "./redux/auth-selectors";
import {startDialogsListening, stopDialogsListening} from "./redux/dialogs-reducer";
import {Messages} from "./components/Messages/Messages";
import {Dialogs} from "./components/Dialogs/Dialogs";
import {Avatar, Button, notification, Result} from "antd";
import {Nav} from "./components/Nav/Nav";
import {Register} from "./components/Register/Register";
import {Info} from "./components/Info/Info";
import {useMediaQuery} from 'react-responsive'
import reactStringReplace from "react-string-replace";
import {Emoji} from "emoji-mart";
import {urls} from "./api/api";
import userWithoutPhoto from "./assets/images/man.png";
import s from "./components/Messages/Messages.module.css";
import {CloudDownloadOutlined} from "@ant-design/icons";

export const App: React.FC = () => {
    const isAuth = useSelector(s_getIsAuth);
    const initialised = useSelector(s_getInitialised);
    const newMessageReceived = useSelector(s_getNewMessageReceived);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuth)
            dispatch(startDialogsListening());
        dispatch(initialiseApp());
        return () => {
            if (isAuth)
                dispatch(stopDialogsListening());
        }
    }, [isAuth]);

    useEffect(() => {
        if (newMessageReceived !== null) {
            notification.open({
                message: newMessageReceived?.user.nickName,
                description: (
                    <div>
                        <div>
                            {newMessageReceived.files.length > 0 &&
                            <div className='files'>
                                {newMessageReceived.files.map(file => {
                                    if (file.type.match(/image/) !== null)
                                        return <div>
                                            <img
                                                className='message_photo'
                                                src={urls.pathToFilesPinnedToMessage + file.name}
                                                alt={file.name}
                                            />
                                        </div>
                                    else
                                        return <div className={s.message_file}>
                                            <Avatar icon={<CloudDownloadOutlined/>}/>
                                            <div>{file.name}</div>
                                        </div>
                                })
                                }
                            </div>
                            }
                            <div>
                                {reactStringReplace(newMessageReceived?.messageText,
                                    /:(.+?):/,
                                    (match) => (
                                        <Emoji size={26} emoji={match} set='apple'/>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            <small>{newMessageReceived?.dateCreate.toString().substr(11, 5)}</small>
                        </div>
                    </div>
                ),
                icon: <Avatar shape="square" size={32}
                              src={newMessageReceived?.user.avaPhoto ? urls.pathToUsersPhotos + newMessageReceived?.user.avaPhoto : userWithoutPhoto}
                />,
                duration: 10,
                placement: "topRight"
            });
            dispatch(actions.setMessageReceived(null));
        }
    }, [newMessageReceived])

    if (!initialised)
        return <Loading/>;

    return (
        <div className='container'>
            <Switch>
                <Route exact path="/" render={() => <MainPage/>}/>
                <Route path="/profile" render={() => <MainPage/>}/>
                <Route path="/users" render={() => <MainPage/>}/>
                <Route path="/settings" render={() => <MainPage/>}/>
                <Route path="/dialog" render={() => <MainPage/>}/>
                <Route path="/dialoginfo" render={() => <MainPage/>}/>
                <Route path="/login" render={() => <Login/>}/>
                <Route path="/register" render={() => <Register/>}/>
                <Route path="*" render={() => <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button type="primary" onClick={() => history.push('/')}>Back Home</Button>}
                />}/>
            </Switch>
        </div>
    );
}

const MainPage: React.FC = () => {
    const isPhone = useMediaQuery({query: '(max-width: 900px)'})
    const isAuth = useSelector(s_getIsAuth);
    const pageOpened = useSelector(s_getPageOpened);
    const [isOpenInfoPage, setIsOpenInfoPage] = useState(true);
    if (!isAuth)
        return <Redirect to='/login'/>

    return (
        <>
            <div className={['content', isOpenInfoPage ? '' : 'info_page_close'].join(' ')}>
                <div className='nav'>
                    <Nav isOpenInfoPage={isOpenInfoPage} setIsOpenInfoPage={setIsOpenInfoPage}/>
                </div>
                {(!isPhone || pageOpened === 'dialogs') &&
                <div className='dialogs'>
                    <Dialogs/>
                </div>
                }
                {(!isPhone || pageOpened === 'messages') &&
                <div className='messages'>
                    <Messages/>
                </div>
                }
                {(!isPhone || pageOpened === 'info') &&
                <div className='info_page'>
                    <Info isOpenInfoPage={isOpenInfoPage} setIsOpenInfoPage={setIsOpenInfoPage}/>
                </div>
                }
            </div>
        </>
    )
};
