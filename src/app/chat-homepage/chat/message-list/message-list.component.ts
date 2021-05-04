import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { ChatsService } from 'src/app/shared/chats.service';
import { LocalMessagesService } from 'src/app/shared/local-messages.service';
import { SignalService } from 'src/app/signal/signal.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  localMessages: string[];
  localMessagesSubscription: Subscription;

  constructor(
    public chatsService: ChatsService,
    public authService: AuthService,
    public SignalService: SignalService,
    private localMessagesService: LocalMessagesService
  ) { }

  ngOnInit(): void {
    this.localMessagesSubscription = this.localMessagesService.updateMessageList.subscribe((result: string[]) => {
      this.localMessages = result;
    });
  }

  ngOnDestroy() {
    this.localMessagesSubscription.unsubscribe;
  }
}
