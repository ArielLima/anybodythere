import { Component } from "react";
import React from "react";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { auth } from '../../utils';

export function Message(props) {
  const { text, uid, username } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'Messages-message currentMember' : 'Messages-message';

  return (
    <>
      <li className={messageClass}>
        <div className={"Message-content"}>
          <div className="username">{username}</div>
          <div className="text">{text}</div>
        </div>
      </li>
    </>)
}