import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public manageContactsService: ManageContactsService
  ) {}

  ngOnInit(): void {}
}
