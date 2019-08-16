import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core-modules/core-services/auth.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  form: FormGroup;

  isChanged: boolean;

  constructor(private formBuilder: FormBuilder,
              private service: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    }, {validators: CustomValidators.passwordMatch});
  }

  onSubmit() {
    const token = this.route.snapshot.paramMap.get('token');
    const user = this.form.value;
    this.service.resetPassword(user.password, token)
      .pipe(tap({error: (err: HttpErrorResponse) => {
          if (err.error.new_password) {
            this.form.get('password').setErrors({passwordused: true});
          } else if (err.error.token) { // invalid token
            this.router.navigateByUrl('/error/expired');
          }
        }
      }))
      .subscribe(() => this.isChanged = true);
  }

}
