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

  public user: User;

  public navLinks: { label, path, disabled }[] = [
    {label: 'Transactions', path: '/portal', disabled: !this.profileService.isProfileCompleted},
    {label: 'Addresses', path: '/addresses', disabled: !this.profileService.isProfileCompleted},
    {label: 'Profile', path: '/profile', disabled: false},
  ];

  constructor(private authService: AuthService,
              private profileService: ProfileService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
