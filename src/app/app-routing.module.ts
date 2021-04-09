import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { SigninEmailPasswordComponent } from './auth/signin-email-password/signin-email-password.component';
import { ChooseSiginMethodComponent } from './auth/choose-sigin-method/choose-sigin-method.component';
import { CreateAccountComponent } from './auth/create-account/create-account.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', component: ChooseSiginMethodComponent },
      { path: 'signin', component: SigninEmailPasswordComponent },
      { path: 'signin/create-account', component: CreateAccountComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
