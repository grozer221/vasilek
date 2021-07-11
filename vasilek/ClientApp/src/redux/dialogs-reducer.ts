const SEND_MESSAGE = 'SEND-MESSAGE';

type DialogType = {
  id: number,
  name: string,
}

type MessageType = {
  id: number,
  message: string,
}

let initialState = {
  dialogs: [
    { id: 1, name: 'Grozer' },
    { id: 2, name: 'Prozer' },
    { id: 3, name: 'Zhozer' },
    { id: 4, name: 'Lozer' }
  ] as Array<DialogType>,
  messages: [
    { id: 1, message: 'fffffff' },
    { id: 2, message: 'asrgrea' },
    { id: 3, message: 'ffffbbbbfagff' }
  ] as Array<MessageType>
};

export type InitialStateType = typeof initialState

const dialogsReducer = (state = initialState, action: any): InitialStateType => {
  switch (action.type) {
    case SEND_MESSAGE:
      let body = action.newMessageBody;
      return {
        ...state,
        messages: [...state.messages, { id: 4, message: body }]
      };
    default:
      return state;
  }
};

type sendMessageActionCreatorType = {
  type: typeof SEND_MESSAGE
  newMessageBody: string
}

export const sendMessageActionCreator = (newMessageBody: string): sendMessageActionCreatorType => ({ type: SEND_MESSAGE, newMessageBody });

export default dialogsReducer;