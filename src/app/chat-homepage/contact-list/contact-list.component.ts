import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contactList = [];
  subsciption: Subscription;

  constructor(private manageContactsService: ManageContactsService) {}

  ngOnInit(): void {
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
      });
  }

  findContact(form: NgForm) {
    const contact: string = form.value.email;

    //cheks if contact email is on contact list
    //some returns true if does
    const exists = this.contactList.some((user) => user.email === contact);

    if (!exists) {
      this.manageContactsService.findContact(contact);
      console.log('succesfully added contact');
    } else {
      alert('user is already on your contacts list');
    }

    form.resetForm();
  }
}
