import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ChatsService } from 'src/app/shared/chats.service';
import { SignalService } from 'src/app/signal/signal.service';
import { SendMessageComponent } from "../send-message/send-message.component";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
  constructor(
    public chatsService: ChatsService,
    public authService: AuthService,
    public SignalService: SignalService
  ) { }

  ngOnInit(): void { }
}
