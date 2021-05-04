import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { ChatsService } from 'src/app/shared/chats.service';
import { LocalMessagesService } from 'src/app/shared/local-messages.service';
import { User } from 'src/app/shared/models/user.model';
import { SignalService } from 'src/app/signal/signal.service';
import { Message } from "../../../shared/models/message.model";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  localMessages: string[];
  localMessagesSubscription: Subscription;
  decryptedMessages: Message[] = [];

  currentUser: User;

  constructor(
    public chatsService: ChatsService,
    public authService: AuthService,
    public signalService: SignalService,
    private localMessagesService: LocalMessagesService,
    private angularFireAuth: AngularFireAuth
  ) {

  }

  ngOnInit(): void {
    this.getCurrentUser();

    this.localMessagesSubscription = this.localMessagesService.updateMessageList.subscribe((result: string[]) => {
      this.localMessages = result;
    });


    this.chatsService.currentChat$.subscribe(result => {
      result.messages.map((message: Message) => {
        console.log(message);
        //decrypt mesages only if user is a receiver
        if (this.currentUser.email !== message.sender)
          this.decryptMessage(message);
      }

      );
    }, error => {
      console.log(error);
    });

    this.signalService.updatedecryptedMessages.subscribe(result => {
      this.decryptedMessages = result;
    });
  }

  ngOnDestroy() {
    this.localMessagesSubscription.unsubscribe;
  }

  async getCurrentUser() {
    this.currentUser = await this.authService.getUser();
    console.log(this.currentUser);
  }

  async decryptMessage(message: Message) {
    //cheks if message is already decrypted
    const exists = this.decryptedMessages.some((_message: Message) => message.createdAt === _message.createdAt);

    if (!exists) {
      await this.signalService.decryptMessage(message);
    }

    //console.log(this.decryptedMessage);
  }
}
