import React, {FC, useRef, useState} from "react";
import {ScrollView, StyleSheet, TextInput, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";
import {Message} from "./Message";
import {DialogType} from "../../api/dialogs-api";
// @ts-ignore
import userWithoutPhoto from "../../assets/images/man.png";
import {urls} from "../../api/api";
import {makeMessageRead, sendMessage} from "../../redux/dialogs-reducer";
import {s_getCurrentUserId, s_getIsAuth} from "../../redux/auth-selectors";
// @ts-ignore
import AutoScroll from 'react-native-auto-scroll'

export const MessagesScreen: FC = () => {
    const dispatch = useDispatch();
    const currentUserId = useSelector(s_getCurrentUserId);
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId) as number;
    const isAuth = useSelector(s_getIsAuth);
    const currentDialog = dialogs.find(dialog => dialog.id === currentDialogId) as DialogType;

    const messagesAnchorRef = useRef<any>(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);

    const [newMessage, setNewMessage] = useState('');
    const [files, setFiles] = useState([] as File[]);

    const submitSendMessage = (e: any) => {
        let result = newMessage.match(/^\s*$/);
        const isMessageProvided = !result || files.length > 0
        if (isMessageProvided && isAuth && currentDialogId) {
            dispatch(sendMessage(currentDialogId, newMessage, files));
            setNewMessage('');
            setFiles([]);
        }
    }

    const scroll = () => {
        messagesAnchorRef.current?.scrollToEnd()
    }

    const scrollHandler = (e: any) => {
        const element = e.currentTarget;
        let scrollPosition = Math.abs(element.scrollHeight - element.scrollTop) - element.clientHeight;
        //console.log(scrollPosition)
        if (scrollPosition < 100)
            !isAutoScroll && setIsAutoScroll(true);
        else
            isAutoScroll && setIsAutoScroll(false);

        if (scrollPosition < 15)
            checkIfReadMessages()
    };

    const checkIfReadMessages = () => {
        currentDialog?.messages?.forEach(message => {
            message.usersUnReadMessage?.forEach(user => {
                if (user.id === currentUserId) {
                    dispatch(makeMessageRead(currentDialogId, message.id))
                    //console.log(message.user.nickName + ': ' + message.messageText)
                }
            });
        });
    };

    return (
        <View style={s.wrapper}>
            <AutoScroll>
                {currentDialog?.messages?.map(message => <Message key={message.id} message={message} isDialogBetween2={currentDialog.isDialogBetween2}/>)}
            </AutoScroll>
            {/*<ScrollView onScroll={scrollHandler}>*/}
            {/*    {currentDialog?.messages.map(message => <Message key={message.id} message={message}/>)}*/}
            {/*</ScrollView>*/}
            <View>
                <TextInput style={s.messageInput}
                           value={newMessage}
                           onChangeText={setNewMessage}
                           onSubmitEditing={submitSendMessage}
                />
            </View>
        </View>
    );
};

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'black',
    },
    messageInput: {
        backgroundColor: '#2a2a2a',
        color: 'white',
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
        borderRadius: 10,
        borderStyle: "solid",
        borderColor: 'blue',
    },
})
