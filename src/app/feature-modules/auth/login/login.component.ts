import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { of } from 'rxjs';
import { OfferService } from '../../../core-modules/core-services/offer.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private service: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private offerService: OfferService) { }

  ngOnInit() {
    const isAccountActivated = !!this.route.snapshot.queryParams.activated;

    if (isAccountActivated) {
      this.snackBar.open('Your account has been activated successfully.', 'OK', {duration: 5000});
    }

    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  onSubmit() {
    const user = new User(this.form.value);
    const url = this.redirectUrl;
    this.service.login(user)
      .subscribe(() => this.router.navigateByUrl(url));
  }

  private get redirectUrl(): string {
    let uri = this.route.snapshot.queryParams.redirectUrl || '/portal';
    if (this.hasOfferData) {
      uri = '/portal/step-1';
    }
    return uri;
  }


  private get hasOfferData(): boolean {
    return !!localStorage.getItem(LocalStorageKey.Offer);
  }

}
