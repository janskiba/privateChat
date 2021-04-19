import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() childContact;

  constructor(private manageContactsService: ManageContactsService) {}

  ngOnInit(): void {}

  onContactClick(userName: string) {
    this.manageContactsService.displayClickedContact(userName);
    console.log(userName);
  }
}
