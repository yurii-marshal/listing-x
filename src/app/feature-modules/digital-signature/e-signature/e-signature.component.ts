import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SignatureBoxComponent, SignMode } from '../components/signature-box/signature-box.component';
import { map, scan, tap } from 'rxjs/operators';
import { merge } from 'rxjs';

@Component({
  selector: 'app-e-signature',
  templateUrl: './e-signature.component.html',
  styleUrls: ['./e-signature.component.scss']
})
export class ESignatureComponent implements OnInit, AfterViewInit {
  currentYear: number = new Date().getFullYear();

  signEnabled: boolean;

  progress: number;

  @ViewChildren(SignatureBoxComponent)
  private signatures: QueryList<SignatureBoxComponent>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const signSteams = this.signatures.map(component => component.sign);

    const count = this.signatures.length;
    merge(...signSteams)
      .pipe(
        scan((total: number, state: SignMode) => total - state, count),
        tap((value: number) => this.progress = Math.ceil(100 * (count - value) / count)),
        map((diff: number) => diff === 0),
        tap(done => this.signEnabled = done)
      )
      .subscribe(done => console.log('Done', done));
  }


  signAnAgreement() {

  }

}
