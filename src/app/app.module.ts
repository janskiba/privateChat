import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { SigninEmailPasswordComponent } from './auth/signin-email-password/signin-email-password.component';
import { ChooseSiginMethodComponent } from './auth/choose-sigin-method/choose-sigin-method.component';
import { CreateAccountComponent } from './auth/create-account/create-account.component';
/* import { AuthRoutingModule } from './auth/auth-routing.module';
 */
@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SigninEmailPasswordComponent,
    ChooseSiginMethodComponent,
    CreateAccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
