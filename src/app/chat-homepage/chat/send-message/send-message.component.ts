import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatsService } from 'src/app/shared/chats.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';
import { SignalStoreService } from 'src/app/signal/signal-store.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit, OnDestroy {
  /*   contactData: any;
   */
  constructor(
    private chatsService: ChatsService,
    public manageContactsService: ManageContactsService,
    private signalStoreService: SignalStoreService
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  onSubmit(form: NgForm, contact) {
    const message = form.value.message;
    this.signalStoreService.encryptAndSendMessage(contact.chatId, message);
    form.reset();
  }
}
