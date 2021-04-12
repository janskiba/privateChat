import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['../signin-email-password/signin-email-password.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  ngOnInit(): void {}

  onSubmit(from: NgForm) {
    console.log(from.value);
  }
}
