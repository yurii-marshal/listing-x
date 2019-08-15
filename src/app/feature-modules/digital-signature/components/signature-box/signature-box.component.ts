import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../../core-modules/core-services/auth.service';
import { User } from '../../../auth/models';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../../../../core-modules/models/offer';

export enum SignMode {
  Sign = 1,
  UnSign = -1
}

@Component({
  selector: 'app-signature-box',
  templateUrl: './signature-box.component.html',
  styleUrls: ['./signature-box.component.scss']
})
export class SignatureBoxComponent implements OnInit {
  @Input()
  user: Person;

  @Input()
  signWithInitials: boolean = true;

  @Output()
  sign: EventEmitter<SignMode> = new EventEmitter<SignMode>();

  mode: SignMode = SignMode.Sign;

  SignMode = SignMode;

  get isCurrentUser(): boolean {
    const curUser: User = this.authService.currentUser;
    return curUser.lastName === this.user.lastName
      && curUser.firstName === this.user.firstName
      && curUser.email === this.user.email;
  }

  constructor(private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
  }

  process() {
    this.sign.emit(this.mode);
    // Toggle
    if (this.mode === SignMode.Sign) {
      this.mode = SignMode.UnSign;
    } else {
      this.mode = SignMode.Sign;
    }
  }
}
