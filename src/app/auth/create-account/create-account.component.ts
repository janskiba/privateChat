import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['../signin-email-password/signin-email-password.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    this.authService.createAccountEmailPassword(
      form.value.email,
      form.value.password
    );
  }
}
