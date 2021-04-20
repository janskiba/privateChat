import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ChatsService } from 'src/app/shared/chats.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

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
    private chatsService: ChatsService
  ) {}

  ngOnInit(): void {}

  onContactClick(contact) {
    this.manageContactsService.displayClickedContact(contact);
  }
}
