import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { MatSnackBar } from '@angular/material';
import { User } from '../../auth/models';
import { ProfileService } from '../../../core-modules/core-services/profile.service';
import { NotificationType } from '../../../core-modules/enums/notification-type';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public user: User;

  public form: FormGroup;

  public noteTypes = NotificationType;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private profileService: ProfileService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.user = this.authService.currentUser;

    this.form = this.formBuilder.group({
      company_name: [this.profileService.isProfileCompleted && this.user.company_name, [Validators.required]],
      license_number: [
        this.profileService.isProfileCompleted && this.user.license_number,
        [Validators.required, CustomValidators.number, Validators.maxLength(9)]
      ],
      broker_number: [
        this.profileService.isProfileCompleted && this.user.broker_number,
        [Validators.required, CustomValidators.number, Validators.maxLength(8)]
      ],
      address: [this.profileService.isProfileCompleted && this.user.address, [Validators.required]],
      phone_number: [this.profileService.isProfileCompleted && this.user.phone_number, [Validators.required]],
    });
  }

  public onSubmit(): void {
    this.profileService.updateProfile(this.form.value)
      .subscribe(() => this.snackBar.open(
        'Profile has been updated',
        'OK',
        {duration: 5000}));
  }

}
