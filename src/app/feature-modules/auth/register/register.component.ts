import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { User } from '../models';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { UserRole } from '../../../core-modules/enums/user-role';

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
              private service: AuthService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      account_type: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    }, {validator: CustomValidators.passwordMatch});
  }

  public selectRole(role): void {
    this.form.controls.account_type.setValue(role);
  }

  public onSubmit(): void {
    const user = {
      ...this.form.value,
      email: this.form.value.email.toLowerCase()
    } as User;

    this.service.register(user)
      .pipe(
        tap({error: err => this.form.get('email').setErrors({uniqemail: true})})
      )
      .subscribe(() => this.isActivated = true);
  }

  public onResendEmail(): void {
    const user: User = this.form.value;
    this.service.resendActivation(user.email)
      .subscribe(() =>
        this.snackBar.open(
          'Activation link re-sent to your email',
          'OK',
          {duration: 5000})
      );
  }

}
