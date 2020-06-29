import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { User } from '../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  private get redirectUrl(): string {
    let uri = this.route.snapshot.queryParams.redirectUrl || '/portal';

    if (this.hasOfferData) {
      uri = '/portal/offer';
    }

    if (this.authService.currentUser.account_type === 'agent' && !this.authService.currentUser.registration_finished) {
      uri = '/profile';
    }

    return uri;
  }

  private get hasOfferData(): boolean {
    return !!localStorage.getItem(LocalStorageKey.Offer);
  }

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

  public onSubmit(): void {
    const url = this.redirectUrl;

    const data = {
      ...this.form.value,
      email: this.form.value.email.toLowerCase()
    } as User;

    this.authService.login(data)
      .subscribe(() => this.router.navigateByUrl(url));
  }

}
