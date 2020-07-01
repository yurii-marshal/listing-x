import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../feature-modules/auth/models';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { ProfileService } from '../../../core-modules/core-services/profile.service';

@Component({
  selector: 'app-base-template',
  templateUrl: './base-template.component.html',
  styleUrls: ['./base-template.component.scss']
})
export class BaseTemplateComponent implements OnInit {
  @Input()
  isVisibleNavBar: boolean = true;

  @Input()
  state: string = 'portal';

  user: User;

  portalNavLinks: { label, path, disabled, hidden }[] = [];

  purchaseNavLinks: { label, path, disabled }[] = [];

  constructor(private authService: AuthService,
              private profileService: ProfileService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;

    this.portalNavLinks = [
      {label: 'Transactions', path: '/portal', disabled: !this.user.registrationCompleted, hidden: false},
      {label: 'Addresses', path: '/addresses', disabled: !this.user.registrationCompleted, hidden: false},
      {label: 'Profile', path: '/profile', disabled: false, hidden: this.user.accountType === 'customer'},
    ];

    this.purchaseNavLinks = [
      {label: 'Step 1', path: ['./../step-one'], disabled: false},
      {label: 'Step 2', path: ['./../step-two'], disabled: false},
      {label: 'Step 3', path: ['./../step-three'], disabled: false},
      {label: 'Summary', path: ['./../summary'], disabled: false},
    ];
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
