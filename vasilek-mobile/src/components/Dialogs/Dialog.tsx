import React, {FC, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DialogType, MessageType} from '../../api/dialogs-api';
// @ts-ignore
import userWithoutPhoto from '../../assets/images/man.png';
import {useDispatch, useSelector} from 'react-redux';
import {actions, deleteDialog} from '../../redux/dialogs-reducer';
import {Badge, Modal, SwipeAction} from '@ant-design/react-native';
import {s_getCurrentUserId} from '../../redux/auth-selectors';
import {IconOutline} from '@ant-design/icons-react-native';
import {useNavigation} from '@react-navigation/native';
import {urls} from '../../api/api';

type Props = {
    dialog: DialogType,
}

export const Dialog: FC<Props> = ({dialog}) => {
    const dispatch = useDispatch();
    const currentUserId = useSelector(s_getCurrentUserId);
    const navigation = useNavigation();

    useEffect(() => {
        return () => {
            dispatch(actions.setCurrentDialogId(null));
        };
    }, []);

    const right = [
        {
            text: <IconOutline size={24} style={[s.buttonIcon, {backgroundColor: 'red'}]}
                               name="delete"/>,
            onPress: () => onDeleteDialogClick(),
            style: {backgroundColor: 'red', color: 'black'},
        },
    ];

    const onDeleteDialogClick = () => {
        Modal.alert('Warning', <Text>Do you really want to delete dialog <Text
            style={{fontWeight: 'bold'}}>{dialog.dialogName}</Text>?</Text>, [
            {
                text: 'Cancel',
                onPress: () => console.log('cancel'),
                style: 'cancel',
            },
            {text: 'OK', onPress: () => dispatch(deleteDialog(dialog.id)) as any},
        ]);
    };

    const pressChooseDialog = () => {
        dispatch(actions.setCurrentDialogId(dialog.id));
        // @ts-ignore
        navigation.navigate('Messages');
    };

    const countUnReadMessages = (messages: MessageType[]): number => {
        let count = 0;
        messages?.forEach(message => {
            if (message.usersUnReadMessage?.find(user => user.id === currentUserId))
                count++;
        });
        return count;
    };

    let lastMessage: MessageType | null;
    if (dialog?.messages?.length)
        lastMessage = dialog?.messages[dialog?.messages?.length - 1];
    else
        lastMessage = null;

    return (
        <SwipeAction right={right}>
            <TouchableOpacity style={s.wrapper}
                              onPress={pressChooseDialog}>
                <Image style={s.ava}
                       source={dialog.dialogPhoto ? {uri: urls.pathToUsersPhotos + dialog.dialogPhoto} : userWithoutPhoto}/>
                <Badge text={countUnReadMessages(dialog?.messages)} style={s.badge} size={'small'}/>
                {dialog.isDialogBetween2 && dialog.users.filter(user => user.id !== currentUserId)[0]?.isOnline &&
                <View style={s.onlineIndicator}/>
                }
                <View>
                    <Text style={[s.text, s.dialogName]}>{dialog.dialogName}</Text>
                    <View style={s.wrapperLastMessage}>
                        {lastMessage
                            ? lastMessage.user.id === currentUserId
                                ? <Text style={s.text}>You: </Text>
                                : lastMessage.user.nickName.length > 15
                                    ? dialog.isDialogBetween2 ||
                                    <Text
                                        style={s.text}>{lastMessage.user.nickName.substr(0, 15) + '... : '}</Text>
                                    : dialog.isDialogBetween2 ||
                                    <Text style={s.text}>{lastMessage.user.nickName.substr(0, 15) + ': '}</Text>
                            : null
                        }
                        {lastMessage
                            ? <Text
                                style={[s.text, s.lastMessage]}>{lastMessage.messageText.substr(0, 30)}{lastMessage.messageText.length > 20 && '...'}</Text>
                            : null
                        }
                    </View>
                </View>
            </TouchableOpacity>
        </SwipeAction>
    );
};

const s = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    text: {
        color: 'white',
    },
    ava: {
        width: 60,
        height: 60,
        marginBottom: 10,
        marginRight: 10,
        borderRadius: 50,
    },
    wrapperLastMessage: {
        flexDirection: 'row',
    },
    dialogName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    lastMessage: {
        color: 'grey',
    },
    badge: {
        position: 'absolute',
        top: 10,
        left: 50,
    },
    onlineIndicator: {
        position: 'absolute',
        top: 60,
        left: 55,
        width: 10,
        height: 10,
        backgroundColor: '#3498DB',
        borderRadius: 50,
    },
    buttonIcon: {
        color: 'white',
        padding: 15,
        borderRadius: 10,
    },
});
