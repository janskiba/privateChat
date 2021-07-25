import { Component, OnInit } from '@angular/core';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor(public manageContactsService: ManageContactsService) {}

  ngOnInit(): void {}
}
