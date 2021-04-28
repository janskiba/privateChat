import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ChatsService } from 'src/app/shared/chats.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';
import { SignalStoreService } from 'src/app/signal/signal-store.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() childContact;

  constructor(
    private authService: AuthService,
    private manageContactsService: ManageContactsService,
    private signalStoreService: SignalStoreService
  ) { }

  ngOnInit(): void { }

  onContactClick(contact) {
    this.manageContactsService.displayClickedContact(contact);
    this.signalStoreService.getPreKeyBundle(contact.email, contact.chatId);
  }
}
