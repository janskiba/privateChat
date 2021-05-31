import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AsyncSubject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Contact } from './models/contact.model';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LocalMessagesService {
  newMessage = new Subject;
  localStorageMessageList: object[] = [];

  constructor(private angularFireAuth: AngularFireAuth) {
  }

  getLoggedInUser() {
    return this.angularFireAuth.authState.pipe(first()).toPromise();
  }

  //creates new obnject in local storage to store a conversasion
  //works when user user clicks on contact and this object doesn't exists
  async createNewObject(contactEmail: string, currentUser: User) {
    const localStorageList = localStorage.getItem(`${contactEmail}`);
    if (!localStorageList) {
      localStorage.setItem(`${contactEmail}`, JSON.stringify(this.localStorageMessageList));
    } else { //load already stored messages from localStorage
      this.localStorageMessageList = JSON.parse(localStorageList);
      this.loadLocalMessages(this.localStorageMessageList);
    }
  }

  loadLocalMessages(messageList: object[] = []) {
    console.log("createNewObject actvated");
    messageList.forEach(message => {
      this.newMessage.next(message);
      console.log(message);
    });
  }

  //save message sent by loggedIn user
  async addCurrentUserMessage(contactEmail: string, message: string) {
    const user = await this.getLoggedInUser();

    const messageData = {
      content: {
        body: message,
      },
      sender: user.email,
    };
    //save message to localStorage
    this.storeMessage(contactEmail, messageData);

    //inform other components about new message
    this.newMessage.next(messageData);
  }

  //save message sent by contact
  addContactMessage(contactEmail: string, message: string) {
    const messageData = {
      content: {
        body: message,
      },
      sender: contactEmail,
    };

    //save message to localStorage
    this.storeMessage(contactEmail, messageData);

    //inform other components about new message
    this.newMessage.next(messageData);
  }

  storeMessage(contactEmail: string, message: {}) {
    this.localStorageMessageList.push(message);
    localStorage.setItem(`${contactEmail}`, JSON.stringify(this.localStorageMessageList));
  }


}
