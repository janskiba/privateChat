import { Component, Input, OnInit } from '@angular/core';
import { LocalMessagesService } from 'src/app/shared/local-messages.service';

import { ManageContactsService } from 'src/app/shared/manage-contacts.service';
import { Contact } from 'src/app/shared/models/contact.model';
import { SignalService } from 'src/app/signal/signal.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  //contact's data received from contact list
  @Input() childContact: Contact;

  constructor(
    private manageContactsService: ManageContactsService,
    private SignalService: SignalService,
    private localMessagesService: LocalMessagesService
  ) { }

  ngOnInit(): void { }

  onContactClick(contact: Contact) {
    this.manageContactsService.displayClickedContact(contact);
    this.SignalService.getPreKeyBundle(contact.email, contact.chatId);
  }
}
