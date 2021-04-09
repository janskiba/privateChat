import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninEmailPasswordComponent } from './signin-email-password.component';

describe('SigninEmailPasswordComponent', () => {
  let component: SigninEmailPasswordComponent;
  let fixture: ComponentFixture<SigninEmailPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigninEmailPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninEmailPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
