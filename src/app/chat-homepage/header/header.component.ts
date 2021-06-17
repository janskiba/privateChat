import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ManageContactsService } from 'src/app/shared/manage-contacts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  //handle ngClass on mobile devices, if 'flase' contact list is full width,
  //if 'true' message list is full width
  isActive = false;

  constructor(
    public authService: AuthService,
    public manageContactsService: ManageContactsService
  ) { }

  ngOnInit(): void {
    this.manageContactsService.activatedEmitter.subscribe(value => {
      this.isActive = value;
    });
  }

  changeEventEmitter() {
    this.manageContactsService.activatedEmitter.emit(false);
  }

}
