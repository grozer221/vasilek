import React, {FC} from 'react';
import {Alert, Image, Linking, StyleSheet, Text, View} from 'react-native';
import {DialogType, MessageType} from '../../api/dialogs-api';
import {s_getCurrentUserId} from '../../redux/auth-selectors';
import {useDispatch, useSelector} from 'react-redux';
import {urls} from '../../api/api';
// @ts-ignore
import userWithoutPhoto from '../../assets/images/man.png';
import reactStringReplace from 'react-string-replace';
import {Emoji} from 'emoji-mart';
import {s_getCurrentDialogId, s_getDialogs} from '../../redux/dialogs-selectors';
import {Modal} from '@ant-design/react-native';
import {deleteMessage} from '../../redux/dialogs-reducer';
import { IconFill, IconOutline } from "@ant-design/icons-react-native";

type Props = {
    message: MessageType,
    isDialogBetween2: boolean,
}

export const Message: FC<Props> = ({message, isDialogBetween2}) => {
    const currentUserId = useSelector(s_getCurrentUserId);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    const dialogs = useSelector(s_getDialogs);
    const currentDialog = dialogs.find(dialog => dialog.id === currentDialogId) as DialogType;
    const dispatch = useDispatch();

    const isMyMessage = (userId: number) => {
        return currentUserId === userId;
    };

    const showConfirm = () => {
        Modal.alert('Title', `Do you want to delete message ${message.messageText}`, [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(deleteMessage(message.id));
                },
            },
        ]);
    };

    const onLinkClick = async (fileName: string) => {
        const supported = await Linking.canOpenURL(urls.pathToFilesPinnedToMessage + fileName);
        if (supported) {
            await Linking.openURL(urls.pathToFilesPinnedToMessage + fileName);
        } else {
            Alert.alert(`Don't know how to open this URL: ${urls.pathToFilesPinnedToMessage + fileName}`);
        }
    };

    return (
        <View style={[s.messageWrapper, isMyMessage(message.user.id) ? s.myMessage : s.othersMessage]}>
            {!isMyMessage(message.user.id) &&
            !isDialogBetween2 &&
            <Image style={s.ava}
                   source={message.user.avaPhoto ? {uri: urls.pathToUsersPhotos + message.user.avaPhoto} : userWithoutPhoto}
            />
            }
            <View style={[s.message, isMyMessage(message.user.id) ? s.myMessageBorder : s.othersMessageBorder]}>
                {/*<Text style={[s.text, s.messageText]}>{message.messageText}  </Text>*/}
                {/*<Text style={[s.text, s.small]}>{message.dateCreate.toString().substr(11, 5)}</Text>*/}
                <View style={s.messageText}>
                    {!isMyMessage(message.user.id) && !isDialogBetween2 &&
                    <View>
                        <Text style={{
                            color: message.user.nickColor,
                            fontWeight: '500',
                        }}>{message.user.nickName}</Text>
                    </View>
                    }
                    <View>
                        {message.files && message.files.map(file => {
                            if (file.type.match(/image/) !== null){
                                console.log(urls.pathToFilesPinnedToMessage + file.name);
                                return <View key={file.id}>
                                    <Image
                                        style={s.messagePhoto}
                                        source={{uri: urls.pathToFilesPinnedToMessage + file.name}}
                                    />
                                </View>;
                            }
                            else
                                return <View style={s.messageFile} key={file.id}
                                             onTouchEnd={() => onLinkClick(file.name)}>
                                    <Text style={s.text}>{file.name}</Text>
                                </View>;

                        })}
                        <View>
                            <Text style={s.text}>
                                {/*{reactStringReplace(message.messageText,*/}
                                {/*    /:(.+?):/,*/}
                                {/*    (match) => (*/}
                                {/*        <Emoji size={26} emoji={match} set="apple"/>*/}
                                {/*    ))}*/}
                                {message.messageText}
                            </Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={[s.text, s.small]}>{message.dateCreate.toString().substr(11, 5)}</Text>
                </View>
                {/*{isMyMessage(message.user.id) && message.usersUnReadMessage && message.usersUnReadMessage.length + 1 === currentDialog.users.length &&*/}
                {/*<View style={s.checks}>*/}
                {/*    <Image style={s.checkLeft} source={{uri: ''}}/>*/}
                {/*</View>*/}
                {/*}*/}
                {/*{isMyMessage(message.user.id) && (!message.usersUnReadMessage || message.usersUnReadMessage.length + 1 !== currentDialog.users.length) &&*/}
                {/*<View style={s.checks}>*/}
                {/*    <Image style={s.checkLeft} source={{uri: ''}}/>*/}
                {/*    <Image style={s.checkRight} source={{uri: ''}}/>*/}
                {/*</View>*/}
                {/*}*/}
                {/*{isMyMessage(message.user.id) &&*/}
                {/*<View style={s.deleteMessage} onTouchEnd={showConfirm}>*/}
                {/*    <Image source={{uri: ''}}/>*/}
                {/*</View>*/}
                {/*}*/}
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    messageWrapper: {
        maxWidth: '80%',
        marginVertical: 3,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    message: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
        backgroundColor: '#2a2a2a',
    },
    myMessageBorder: {
        borderBottomRightRadius: 0,
    },
    othersMessage: {
        alignSelf: 'flex-start',
    },
    othersMessageBorder: {
        borderBottomLeftRadius: 0,
    },
    text: {
        color: 'white',
    },
    small: {
        fontSize: 10,
    },
    messageText: {
        maxWidth: '90%',
        textAlign: 'left',
        marginRight: 10,
    },
    ava: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50,
    },
    messagePhoto: {
        width: 300,
        height: 300,
        marginTop: 7,
        borderRadius: 10,
    },
    messageFile: {},
    checks: {},
    checkLeft: {},
    checkRight: {},
    deleteMessage: {},
});
