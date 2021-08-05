import React from 'react';
import s from './Messages.module.css'
import {MessageType} from "../../api/dialogs-api";
import {useSelector} from "react-redux";
import {s_getCurrentUserId} from "../../redux/auth-selectors";
import reactStringReplace from 'react-string-replace';
import {Emoji} from "emoji-mart";
import {Avatar, Image} from "antd";
import {urls} from "../../api/api";
import userWithoutPhoto from '../../assets/images/man.png';
import {CloudDownloadOutlined} from "@ant-design/icons";

type PropsType = {
    message: MessageType,
    isDialogBetween2: boolean,
}

export const Message: React.FC<PropsType> = ({message, isDialogBetween2}) => {
    const currentUserId = useSelector(s_getCurrentUserId);
    const isMyMessage = (userId: number) => {
        return currentUserId === userId
    }

    return (
        <div key={message.id}
             className={[s.wrapper_message, isMyMessage(message.user.id) ? s.my_message : s.others_message].join(' ')}>
            {!isMyMessage(message.user.id) &&
            !isDialogBetween2 &&
            <Avatar src={message.user.avaPhoto ? urls.pathToUsersPhotos + message.user.avaPhoto : userWithoutPhoto}/>}
            <div
                className={[s.message, isMyMessage(message.user.id) ? s.my_message_border : s.others_message_border].join(' ')}>
                <div className={s.message_content}>
                    <div className={s.message_text}>
                        {!isMyMessage(message.user.id) && !isDialogBetween2 &&
                        <div className={s.nick}>{message.user.nickName}</div>
                        }
                        <div>
                            {message.files && message.files.map(file => {
                                if (file.type.match(/image/) !== null)
                                    return <div>
                                        <Image
                                            className={s.message_photo}
                                            src={urls.pathToFilesPinnedToMessage + file.name}
                                            alt={file.name}
                                        />
                                    </div>
                                else
                                    return <a className={s.message_file}
                                              href={urls.pathToFilesPinnedToMessage + file.name} target='_blank'>
                                        <Avatar icon={<CloudDownloadOutlined/>}/>
                                        <div>{file.name}</div>
                                    </a>

                            })}
                            <div>
                                {reactStringReplace(message.messageText,
                                    /:(.+?):/,
                                    (match) => (
                                        <Emoji size={26} emoji={match} set='apple'/>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <small>{message.dateCreate.toString().substr(11, 5)}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
