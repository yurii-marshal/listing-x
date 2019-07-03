import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core-modules/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private service: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    }, {validators: CustomValidators.passwordMatch});
  }

  onSubmit() {
    const user = new User(this.form.value);
    this.service.resetPassword(user.password)
      .subscribe(() => this.router.navigateByUrl('/portal'));
  }

}
