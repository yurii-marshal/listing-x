import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export enum SignMode {
  Initials,
  Sign,
  UnSign
}


@Component({
  selector: 'app-signature-box',
  templateUrl: './signature-box.component.html',
  styleUrls: ['./signature-box.component.scss']
})
export class SignatureBoxComponent implements OnInit {
  @Input()
  mode: SignMode = SignMode.Initials;

  @Output()
  sign: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  unsign: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
