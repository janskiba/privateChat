import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Contact } from './models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class LocalMessagesService {
  newMessage = new Subject;
  localStorageMessageList: object[] = [];

  constructor(private authService: AuthService) {
  }

  //creates new obnject in local storage to store a conversasion
  //works when user user clicks on contact and this object doesn't exists
  createNewObject(contactEmail: string) {
    const localStorageList = localStorage.getItem(`${contactEmail}`);
    if (!localStorageList) {
      localStorage.setItem(`${contactEmail}`, '[]');
    } else { //load already stored messages from localStorage
      this.localStorageMessageList = JSON.parse(localStorageList);
      this.loadLocalMessages(this.localStorageMessageList);
    }
  }

  loadLocalMessages(messageList: object[] = []) {
    messageList.forEach(message => {
      this.newMessage.next(message);
      console.log(message);
    });
  }

  async addMessage(contact: Contact, message: Message) {
    console.log(contact);
    const currentUser = await this.authService.getUser();
    const messageData = {
      content: {
        body: message,
      },
      sender: currentUser.email,
    };

    console.log(messageData);

    //save message to localStorage
    this.storeMessage(contact.email, messageData);

    //inform other components about new message
    this.newMessage.next(messageData);
  }

  storeMessage(contactEmail: string, message: {}) {
    this.localStorageMessageList.push(message);
    localStorage.setItem(`${contactEmail}`, JSON.stringify(this.localStorageMessageList));
  }


}
