import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contactList = [];

  constructor(private manageContactsService: ManageContactsService) {}

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    this.manageContactsService.getContacts().subscribe((value) => {
      this.contactList = value;
    });
  }

  findContact(form: NgForm) {
    const contact: string = form.value.email;

    //cheks if user is on contact list
    this.contactList.forEach((user) => {
      if (user.email != contact)
        this.manageContactsService.findContact(contact);
      else {
        console.log('user is on your contact list');
      }
    });
    form.resetForm();
  }
}
