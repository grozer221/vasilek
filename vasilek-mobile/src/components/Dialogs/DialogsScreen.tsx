import React, {FC} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {s_getDialogs} from '../../redux/dialogs-selectors';
import {Dialog} from './Dialog';
import {useNavigation} from '@react-navigation/native';

export const DialogsScreen: FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const navigation = useNavigation() as any;

    if (!dialogs.length)
        return (
            <View style={s.wrapperCenter}>
                <Text style={{color: 'grey'}}>You do not have dialogs.</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: 'grey'}}>Go to</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Users')}>
                        <Text style={s.text}> users </Text>
                    </TouchableOpacity>
                    <Text style={{color: 'grey'}}>page and write anyone)</Text>
                </View>
            </View>
        );

    return (
        <ScrollView style={s.wrapper}>
            {dialogs.map(dialog => <Dialog key={dialog.id} dialog={dialog}/>)}
        </ScrollView>
    );
};

const s = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'black',
    },
    wrapperCenter: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
    },
    menu: {
        position: 'absolute',
        width: '80%',
        height: '100%',
        top: 0,
        left: '-80%',
        borderStyle: 'solid',
        borderColor: 'yellow',
        borderWidth: 1,
    },
});
