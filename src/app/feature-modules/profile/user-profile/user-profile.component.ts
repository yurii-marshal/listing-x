import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { MatSnackBar } from '@angular/material';
import { User } from '../../auth/models';
import { ProfileService } from '../../../core-modules/core-services/profile.service';
import { NotificationType } from '../../../core-modules/enums/notification-type';
import { CustomValidators } from '../../../core-modules/validators/custom-validators';
import { Agent } from '../../../core-modules/models/agent';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public user: User;
  public agent: Agent;

  public form: FormGroup = this.formBuilder.group({});

  public noteTypes = NotificationType;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private route: ActivatedRoute,
              private profileService: ProfileService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.user = this.authService.currentUser;
    this.agent = this.route.snapshot.data.model as Agent;

    this.form = this.formBuilder.group({
      companyName: [this.agent.companyName, [Validators.required]],
      companyLicense: [
        this.agent.companyLicense,
        [Validators.required, CustomValidators.number, Validators.maxLength(9)]
      ],
      licenseCode: [
        this.agent.licenseCode,
        [Validators.required, CustomValidators.number, Validators.maxLength(8)]
      ],
      physicalAddress: [this.agent.physicalAddress, [Validators.required]],
      phoneNumber: [this.agent.phoneNumber, [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (!_.isEqual(this.form.value, this.profileService.currentAgent)) {
      this.profileService.updateAgent(this.form.value)
        .subscribe(() => {
          this.snackBar.open(
            'Profile has been updated',
            'OK',
            {duration: 5000});
          this.profileService.changeUserProps({registrationCompleted: true});
        });
    }
  }

}
