import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-choose-sigin-method',
  templateUrl: './choose-sigin-method.component.html',
  styleUrls: ['./choose-sigin-method.component.scss'],
})
export class ChooseSiginMethodComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
