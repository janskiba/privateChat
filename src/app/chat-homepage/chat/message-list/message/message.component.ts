import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() childMessage;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    /* console.log(this.childMessage); */
  }
}
