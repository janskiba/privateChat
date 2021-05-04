import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalMessagesService {
  messageList: string[] = [];
  updateMessageList = new Subject;

  constructor() { }

  addMessage(message: string) {
    this.messageList.push(message);
    this.updateMessageList.next(this.messageList.slice());
    console.log(this.messageList);
  }

  resetMessageList() {
    this.messageList = [];
    this.updateMessageList.next(this.messageList.slice());
  }
}
