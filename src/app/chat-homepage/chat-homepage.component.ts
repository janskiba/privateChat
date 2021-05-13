import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { SignalService } from '../signal/signal.service';

@Component({
  selector: 'app-chat-homepage',
  templateUrl: './chat-homepage.component.html',
  styleUrls: ['./chat-homepage.component.scss'],
})
export class ChatHomepageComponent implements OnInit {
  constructor(private signalService: SignalService, private authService: AuthService) {
  }

  ngOnInit(): void {
    //load store with prekeyBundle from indexedDb only
    //if user is loggin in (not for the first time) or refreshing a page
    if (!this.authService.isSignedIn) {
      this.signalService;
    }
  }
}
