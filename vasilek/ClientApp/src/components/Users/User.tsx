import React, {useEffect} from 'react';
import s from './Users.module.css';
import userWithoutPhoto from '../../assets/images/man.png';
import {Link, Redirect, useHistory} from 'react-router-dom';
import {ProfileType} from "../../types/types";
import {urls} from "../../api/api";
import {Avatar, Button, Card} from "antd";
import Meta from "antd/es/card/Meta";
import {EditOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {requestCurrentDialogId} from "../../redux/dialogs-reducer";
import {s_getCurrentDialogId} from "../../redux/dialogs-selectors";

type PropsType = {
    user: ProfileType
    isAuth: boolean
    followingInProgress: Array<number>
    follow: (userId: number) => void
    unfollow: (userId: number) => void
}

let User: React.FC<PropsType> = ({user, followingInProgress, follow, unfollow, isAuth}) => {
    const currentDialogsId = useSelector(s_getCurrentDialogId);
    const dispatch = useDispatch();
    const history = useHistory();

    const onClick = async () => {
        await dispatch(requestCurrentDialogId(user.id))
        history.push({pathname: '/dialogs?id=' + currentDialogsId});
    }

    return (
        <Card size="small" style={{width: 270, margin: 15}}>
            <Meta avatar={
                <Link to={'/profile?id=' + user.id}>
                    <Avatar size={80}
                            src={user.avaPhoto !== null ? urls.pathToUsersPhotos + user.avaPhoto : userWithoutPhoto}/>
                </Link>
            }
                  title={<Link to={'/profile?id=' + user.id}>{user.nickName}</Link>}
                  description={
                      <div className={s.user_desk}>
                          {isAuth && (
                              user.isFollowed
                                  ? <Button type={"primary"}
                                            disabled={followingInProgress.some(id => id === user.id)}
                                            onClick={() => unfollow(user.id)}
                                  >UnFollow</Button>

                                  : <Button disabled={followingInProgress.some(id => id === user.id)}
                                            onClick={() => follow(user.id)}
                                  >Follow</Button>

                          )
                          }
                          {isAuth && <EditOutlined size={64} onClick={onClick}/>}
                      </div>
                  }
            />
        </Card>
    );
};

export default User;