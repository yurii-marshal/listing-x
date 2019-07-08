import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core-modules/services/auth.service';
import { User } from '../models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

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
    const user = new User(this.form.value);
    this.service.login(user)
      .subscribe(() => this.router.navigateByUrl('/portal'));
  }
}
