import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { User } from '../models';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { UserRole } from '../../../core-modules/enums/user-role';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup;

  public userRoles: string[] = Object.keys(UserRole).map((role) => role.toLowerCase());

  public isActivated: boolean;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private authService: AuthService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const role = this.route.snapshot.queryParamMap.get('role');
    const email = this.route.snapshot.queryParamMap.get('email');
    const firstName = this.route.snapshot.queryParamMap.get('fn');
    const lastName = this.route.snapshot.queryParamMap.get('ln');

    this.form = this.formBuilder.group({
      accountType: [{value: role || null, disabled: !!role}, [Validators.required]],
      firstName: [{value: firstName, disabled: !!role}, [Validators.required]],
      lastName: [{value: lastName, disabled: !!role}, [Validators.required]],
      email: [{value: email || '', disabled: !!email}, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    }, {validator: CustomValidators.passwordMatch});
  }

  public onSubmit(): void {
    const user = {
      ...this.form.getRawValue(),
      email: this.form.getRawValue().email.toLowerCase()
    } as User;

    this.authService.register(user)
      .pipe(
        tap({
          error: res => {
            if (res.error && res.error.email) {
              this.snackBar.open(res.error.email[0], 'OK');
              this.form.get('email').setErrors({uniqemail: true});
            } else if (res.error && res.error.non_field_errors) {
              this.snackBar.open(res.error.non_field_errors[0], 'OK', {duration: 10000});
            }
          }
        })
      )
      .subscribe(() => this.isActivated = true);
  }

  public onResendEmail(): void {
    const user: User = this.form.value;
    this.authService.resendActivation(user.email)
      .subscribe(() =>
        this.snackBar.open(
          'Activation link re-sent to your email',
          'OK',
          {duration: 5000})
      );
  }

}
