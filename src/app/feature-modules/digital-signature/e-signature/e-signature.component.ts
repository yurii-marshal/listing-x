import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SignatureBoxComponent, SignMode } from '../signature-box/signature-box.component';
import { map, mapTo, scan } from 'rxjs/operators';
import { combineLatest, merge } from 'rxjs';
import * as _ from 'lodash';
import { ProgressBarState } from '../../../core-modules/core-services/progress.service';

@Component({
  selector: 'app-e-signature',
  templateUrl: './e-signature.component.html',
  styleUrls: ['./e-signature.component.scss']
})
export class ESignatureComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();

  @ViewChildren(SignatureBoxComponent)
  private signatures: QueryList<SignatureBoxComponent>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const signSteams = this.signatures.map(component => component.sign);

    const signDone = merge(...signSteams)
      .pipe(
        scan((total: number, state: SignMode) => total - state, this.signatures.length),
        map((diff: number) => diff === 0),
      )
      .subscribe(done => console.log('Done', done));
  }

}
