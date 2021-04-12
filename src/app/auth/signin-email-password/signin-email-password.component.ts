import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signin-email-password',
  templateUrl: './signin-email-password.component.html',
  styleUrls: ['./signin-email-password.component.scss'],
})
export class SigninEmailPasswordComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    console.log(form.value);
  }
}
