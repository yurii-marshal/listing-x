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

  isReadonly: boolean;

  SignMode = SignMode;

  get isCurrentUser(): boolean {
    const currentUser: User = this.authService.currentUser;
    return currentUser.lastName === this.user.lastName
      && currentUser.firstName === this.user.firstName
      && currentUser.email === this.user.email;
  }

  constructor(private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    if (!this.isCurrentUser) {
      this.autoSign();
    }
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

  private autoSign() {
    this.isReadonly = true;
    if (this.user.signed) {
      this.mode = SignMode.UnSign;
    }
  }
}
