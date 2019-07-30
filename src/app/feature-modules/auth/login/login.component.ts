import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';

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
              private snackBar: MatSnackBar) { }

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
    const url = this.redirectUrl;
    this.service.login(this.form.value)
      .subscribe(() => this.router.navigateByUrl(url));
  }

  private get redirectUrl(): string {
    let uri = this.route.snapshot.queryParams.redirectUrl || '/portal';
    if (this.hasOfferData) {
      uri = '/portal/offer';
    }
    return uri;
  }


  private get hasOfferData(): boolean {
    return !!localStorage.getItem(LocalStorageKey.Offer);
  }

}
