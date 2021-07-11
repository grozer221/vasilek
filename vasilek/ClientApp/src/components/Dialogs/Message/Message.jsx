import React from 'react';
import s from './Message.module.css'

function Message(props) {
  return (
    <div className="message">{props.message}</div>
  );
}

export default Message;
