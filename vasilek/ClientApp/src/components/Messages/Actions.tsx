import React from 'react';
import s from './Messages.module.css'
import {useSelector} from "react-redux";
import {s_getCurrentDialogId, s_getDialogs} from "../../redux/dialogs-selectors";

export const Actions: React.FC = () => {
    const dialogs = useSelector(s_getDialogs);
    const currentDialogId = useSelector(s_getCurrentDialogId);
    return (
        <div className={s.actions}>
            <div className={s.nickname}>
                <strong>
                    {dialogs?.find((dialog => dialog?.id === currentDialogId))?.dialogName}
                </strong>
            </div>
        </div>
    );
}

