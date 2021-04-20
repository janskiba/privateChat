import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { disableDebugTools } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  async createChat(contactEmail: string, chatId: string) {
    const currentUser = await this.angularFireAuth.currentUser;

    const data = {
      creator: currentUser.email,
      contact: contactEmail,
      chatId: chatId,
      messages: [],
    };
    console.log(JSON.stringify(data));

    //add currentUser to friend contactlist
    this.updateFriendContactList(data, currentUser.displayName);

    //add doc with contact id to later us it for sending messages
    await this.angularFirestore.collection('chats').doc(`${chatId}`).set(data);
  }

  updateFriendContactList(chatData, contactDisplayname: string) {
    const data = {
      chatId: chatData.chatId,
      displayName: contactDisplayname,
      email: chatData.creator,
    };

    const ref = this.angularFirestore
      .collection('users')
      .doc(`${chatData.contact}`)
      .collection('contacts');

    return ref.doc(`${chatData.chatId}`).set(data);
  }

  async sendMessage(chatId: string, content: string) {
    //add sender to receiver contact list

    const currentUser = await this.angularFireAuth.currentUser;

    const data = {
      sender: currentUser.email,
      content,
    };

    if (currentUser) {
      const ref = this.angularFirestore.collection('chats').doc(chatId);

      //uses the Firestore arrayUnion method to append a new chat message to document
      return ref.update({
        messages: firebase.firestore.FieldValue.arrayUnion(data),
      });
    }
  }
}
