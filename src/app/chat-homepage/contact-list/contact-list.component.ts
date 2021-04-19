import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatsService } from 'src/app/shared/chats.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contacts$: Observable<any>;

  constructor(
    private manageContactsService: ManageContactsService,
    private chatsService: ChatsService
  ) {}

  ngOnInit(): void {
    //subscribe to contacts$ in the template
    this.contacts$ = this.manageContactsService.getContacts();
  }

  findContact(form: NgForm) {
    const contact: string = form.value.email;
    this.manageContactsService.findContact(contact);
    /*     this.chatsService.createChat(contact); */
    form.resetForm();
  }
}
