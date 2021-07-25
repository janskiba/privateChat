import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { ManageContactsService } from 'src/app/shared/manage-contacts.service';
import { Contact } from 'src/app/shared/models/contact.model';
import { LocalMessagesService } from 'src/app/shared/local-messages.service';
@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contactList = [];
  subsciption: Subscription;

  constructor(
    private manageContactsService: ManageContactsService,
    private spinner: NgxSpinnerService,
    private localMessagesService: LocalMessagesService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getContacts();

  }

  ngOnDestroy() {
    this.subsciption.unsubscribe();
  }

  getContacts() {
    this.subsciption = this.manageContactsService
      .getContacts()
      .subscribe((value) => {
        this.contactList = value;
        this.spinner.hide();
      });
  }

  findContact(form: NgForm) {
    const contact: string = form.value.email;

    //cheks if contact email is on contact list
    //method "some()" returns true if does
    const exists = this.contactList.some((user: Contact) => user.email === contact);

    if (!exists) {
      this.manageContactsService.findContact(contact);
      console.log('succesfully added contact');
    } else {
      alert('user is already on your contacts list');
    }

    form.resetForm();
  }
}
