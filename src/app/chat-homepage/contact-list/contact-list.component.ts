import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  constructor(private findContactService: ManageContactsService) {}

  ngOnInit(): void {}

  findContact(form: NgForm) {
    const contact: string = form.value.email;
    this.findContactService.findContact(contact);
    form.resetForm();
  }
}
