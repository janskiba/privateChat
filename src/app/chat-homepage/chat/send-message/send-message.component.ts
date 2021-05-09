import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatsService } from 'src/app/shared/chats.service';
import { LocalMessagesService } from 'src/app/shared/local-messages.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';
import { SignalService } from 'src/app/signal/signal.service';



@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit, OnDestroy {

  constructor(
    private chatsService: ChatsService,
    public manageContactsService: ManageContactsService,
    private SignalService: SignalService,
    private localMessagesService: LocalMessagesService
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  onSubmit(form: NgForm, contact) {
    const message = form.value.message;

    //update local(sender UI)
    this.localMessagesService.addMessage(contact, message);

    //encrypt message and save ot firebase
    this.SignalService.encryptAndSendMessage(contact, message);
    form.reset();
  }
}
