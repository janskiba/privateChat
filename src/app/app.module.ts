import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

//material design icons
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { SigninEmailPasswordComponent } from './auth/signin-email-password/signin-email-password.component';
import { ChooseSiginMethodComponent } from './auth/choose-sigin-method/choose-sigin-method.component';
import { CreateAccountComponent } from './auth/create-account/create-account.component';
import { ChatHomepageComponent } from './chat-homepage/chat-homepage.component';
import { HeaderComponent } from './chat-homepage/header/header.component';
import { ContactListComponent } from './chat-homepage/contact-list/contact-list.component';
import { ChatComponent } from './chat-homepage/chat/chat.component';
import { ContactComponent } from './chat-homepage/contact-list/contact/contact.component';
import { SendMessageComponent } from './chat-homepage/chat/send-message/send-message.component';
import { MessageListComponent } from './chat-homepage/chat/message-list/message-list.component';
import { MessageComponent } from './chat-homepage/chat/message-list/message/message.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SigninEmailPasswordComponent,
    ChooseSiginMethodComponent,
    CreateAccountComponent,
    ChatHomepageComponent,
    HeaderComponent,
    ContactListComponent,
    ChatComponent,
    ContactComponent,
    SendMessageComponent,
    MessageListComponent,
    MessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    NoopAnimationsModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
