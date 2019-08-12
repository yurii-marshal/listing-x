import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  isInitialsMode: boolean = true;

  mode: SignMode = SignMode.Sign;

  SignMode = SignMode;

  @Output()
  sign: EventEmitter<SignMode> = new EventEmitter<SignMode>();

  constructor() { }

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
