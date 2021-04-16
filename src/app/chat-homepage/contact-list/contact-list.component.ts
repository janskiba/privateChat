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
  contacts$: Observable<any>;
  contacts = [];

  constructor(private manageContactsService: ManageContactsService) {}

  ngOnInit(): void {
    this.contacts$ = this.manageContactsService.getContacts();
  }

  findContact(form: NgForm) {
    const contact: string = form.value.email;
    this.manageContactsService.findContact(contact);
    form.resetForm();
  }
}
