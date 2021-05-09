import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { LocalMessagesService } from 'src/app/shared/local-messages.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';
import { Contact } from 'src/app/shared/models/contact.model';
import { SignalService } from 'src/app/signal/signal.service';




@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit, OnDestroy {

  constructor(
    public manageContactsService: ManageContactsService,
    private SignalService: SignalService,
    private localMessagesService: LocalMessagesService
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void { }

  onSubmit(form: NgForm, contact: Contact) {
    const message = form.value.message;

    //update local(sender UI)
    this.localMessagesService.addMessage(contact, message);

    //encrypt message and save ot firebase
    this.SignalService.encryptAndSendMessage(contact, message);
    form.reset();
  }
}
