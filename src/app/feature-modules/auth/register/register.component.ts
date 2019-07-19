import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { User } from '../models';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../../core-modules/core-services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  isActivated: boolean;

  constructor(private formBuilder: FormBuilder,
              private service: AuthService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    }, {validator: CustomValidators.passwordMatch});
  }

  onSubmit() {
    const user: User = this.form.value;
    this.service.register(user)
      .pipe(
        tap({error: err => this.form.get('email').setErrors({uniqemail: true})})
      )
      .subscribe(() => this.isActivated = true);
  }

  onResendEmail() {
    const user: User = this.form.value;
    this.service.resendActivation(user.email)
      .subscribe(() => this.snackBar.open('Activation link re-sent to your email', 'OK', {duration: 5000}));
  }

}
