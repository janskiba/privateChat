import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalMessagesService {
  newMessage = new Subject;

  constructor(private angularFireAuth: AngularFireAuth) {

  }
  async getCurrentUser() {
    const currentUser = await this.angularFireAuth.currentUser;
    return currentUser.email;
  }

  async addMessage(contact, message: Message) {
    const currentUser = await this.angularFireAuth.currentUser;
    const messageData = {
      content: {
        body: message,
      },
      sender: currentUser.email,
    };

    console.log(messageData);

    this.newMessage.next(messageData);
  }
}
