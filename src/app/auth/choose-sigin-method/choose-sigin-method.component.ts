import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { SignalStoreService } from 'src/app/signal/signal-store.service';

@Component({
  selector: 'app-choose-sigin-method',
  templateUrl: './choose-sigin-method.component.html',
  styleUrls: ['./choose-sigin-method.component.scss'],
})
export class ChooseSiginMethodComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public signalStoreService: SignalStoreService
  ) {}

  ngOnInit(): void {}
}
