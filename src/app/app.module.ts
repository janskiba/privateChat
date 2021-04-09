import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { SigninEmailPasswordComponent } from './auth/signin-email-password/signin-email-password.component';
import { ChooseSiginMethodComponent } from './auth/choose-sigin-method/choose-sigin-method.component';
/* import { AuthRoutingModule } from './auth/auth-routing.module';
 */
@NgModule({
  declarations: [AppComponent, AuthComponent, SigninEmailPasswordComponent, ChooseSiginMethodComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    /* AuthRoutingModule */
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
