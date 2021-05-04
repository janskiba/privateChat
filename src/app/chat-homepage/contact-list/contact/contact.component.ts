import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ChatsService } from 'src/app/shared/chats.service';
import { LocalMessagesService } from 'src/app/shared/local-messages.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';
import { SignalService } from 'src/app/signal/signal.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() childContact;

  constructor(
    private localMessagesService: LocalMessagesService,
    private manageContactsService: ManageContactsService,
    private SignalService: SignalService
  ) { }

  ngOnInit(): void { }

  onContactClick(contact) {
    this.manageContactsService.displayClickedContact(contact);
    this.SignalService.getPreKeyBundle(contact.email, contact.chatId);

    //reset local array of so that user messages do not get mixed up
    this.localMessagesService.resetMessageList();
  }
}
