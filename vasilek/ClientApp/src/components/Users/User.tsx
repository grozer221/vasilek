import React from 'react';
import s from './Users.module.css';
import userWithoutPhoto from '../../assets/images/man.png';
import {Link} from 'react-router-dom';
import {ProfileType} from "../../types/types";
import {urls} from "../../api/api";
import {Avatar, Button, Card} from "antd";
import Meta from "antd/es/card/Meta";
import {EditOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {requestCurrentDialogId} from "../../redux/dialogs-reducer";
import {s_getCurrentDialogId} from "../../redux/dialogs-selectors";

type PropsType = {
    User: ProfileType
    isAuth: boolean
    followingInProgress: Array<number>
    follow: (userId: number) => void
    unfollow: (userId: number) => void
}

let User: React.FC<PropsType> = ({User, followingInProgress, follow, unfollow, isAuth}) => {
    const currentDialogsId = useSelector(s_getCurrentDialogId);
    const dispatch = useDispatch();

    const onClick = async () => {
        await dispatch(requestCurrentDialogId(User.Id))
        return <Link to={"dialogs?id=" + currentDialogsId}/>
    }

    return (
        <Card size="small" style={{width: 270, margin: 15}}>
            <Meta avatar={
                <Link to={'/profile?id=' + User.Id}>
                    <Avatar size={80}
                            src={User.AvaPhoto !== null ? urls.pathToUsersPhotos + User.AvaPhoto : userWithoutPhoto}/>
                </Link>
            }
                  title={<Link to={'/profile?id=' + User.Id}>{User.NickName}</Link>}
                  description={
                      <div className={s.user_desk}>
                          {isAuth && (
                              User.IsFollowed
                                  ? <Button type={"primary"}
                                            disabled={followingInProgress.some(id => id === User.Id)}
                                            onClick={() => unfollow(User.Id)}
                                  >UnFollow</Button>

                                  : <Button disabled={followingInProgress.some(id => id === User.Id)}
                                            onClick={() => follow(User.Id)}
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