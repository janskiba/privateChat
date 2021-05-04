import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatsService } from 'src/app/shared/chats.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';
import { SignalService } from 'src/app/signal/signal.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit, OnDestroy {
  private messageList = [];
  updateMessageList = new Subject;

  constructor(
    private chatsService: ChatsService,
    public manageContactsService: ManageContactsService,
    private SignalService: SignalService
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  onSubmit(form: NgForm, contact) {
    const message = form.value.message;

    //emit not encrypted message
    this.messageList.push(message);
    this.updateMessageList.next(this.messageList);

    this.SignalService.encryptAndSendMessage(contact, message);
    form.reset();
  }
}
