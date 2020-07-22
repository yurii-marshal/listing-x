import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { MatSnackBar } from '@angular/material';
import { User } from '../../auth/models';
import { ProfileService } from '../../../core-modules/core-services/profile.service';
import { NotificationType } from '../../../core-modules/enums/notification-type';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { Agent } from '../../../core-modules/models/agent';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  public user: User;

  public form: FormGroup = this.formBuilder.group({});

  public noteTypes = NotificationType;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private profileService: ProfileService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.user = this.authService.currentUser;

    this.buildForm();

    this.profileService.getAgent()
      .pipe(
        takeUntil(this.onDestroyed$),
        catchError(err => {
          this.snackBar.open(`Cannot retrieve agent.`, 'OK');
          return of(null);
        })
      )
      .subscribe((data: Agent) => {
        const names: string[] = Object.keys(this.form.getRawValue());
        const formData = _.pick(data, names);
        this.form.patchValue(formData);
      });
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      companyLicense: ['', [Validators.required, CustomValidators.number, Validators.maxLength(9)]],
      licenseCode: ['', [Validators.required, CustomValidators.number, Validators.maxLength(8)]],
      physicalAddress: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (!_.isEqual(this.form.value, this.profileService.currentAgent)) {
      // this.form.value.phoneNumber = this.form.value.phoneNumber.replace(/\D/g, '');
      this.profileService.updateAgent(this.form.value)
        .subscribe(() => {
          this.snackBar.open(
            'Profile has been updated',
            'OK',
            {duration: 5000});
          this.profileService.changeUserProps({registrationCompleted: true});
          this.router.navigateByUrl('/portal');
        });
    }
  }

}
