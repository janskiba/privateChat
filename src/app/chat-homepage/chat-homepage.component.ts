import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ManageContactsService } from '../shared/manage-contacts.service';
import { SignalService } from '../signal/signal.service';

@Component({
  selector: 'app-chat-homepage',
  templateUrl: './chat-homepage.component.html',
  styleUrls: ['./chat-homepage.component.scss'],
})
export class ChatHomepageComponent implements OnInit {
  //handle ngClass on mobile devices, if 'flase' contact list is full width,
  //if 'true' message list is full width
  isActive = false;

  constructor(
    private signalService: SignalService,
    private authService: AuthService,
    private manageContactsService: ManageContactsService
  ) {
  }

  ngOnInit(): void {
    //load store with prekeyBundle from indexedDb only
    //if user is loggin in (not for the first time) or refreshing a page
    if (!this.authService.isSignedIn) {
      this.signalService;
    }

    this.manageContactsService.activatedEmitter.subscribe(value => {
      this.isActive = value;
    });
  }
}
