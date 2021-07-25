import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-signin-email-password',
  templateUrl: './signin-email-password.component.html',
  styleUrls: ['./signin-email-password.component.scss'],
})
export class SigninEmailPasswordComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    this.authService.signInEmailPassword(form.value.email, form.value.password);
  }
}
