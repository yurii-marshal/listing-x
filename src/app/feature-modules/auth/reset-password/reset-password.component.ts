import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core-modules/services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private service: AuthService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    this.service.requestNewPassword(this.form.get('email').value)
      .pipe(
        tap({error: err => this.form.get('email').setErrors({emailnotfound: true})})
      )
      .subscribe(); // TODO: Navigate to input password
  }
}
