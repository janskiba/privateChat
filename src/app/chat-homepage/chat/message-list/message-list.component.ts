import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { ChatsService } from 'src/app/shared/chats.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
  constructor(
    public chatsService: ChatsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}
}
