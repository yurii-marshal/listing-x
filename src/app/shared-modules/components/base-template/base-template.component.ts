import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../feature-modules/auth/models';
import { AuthService } from '../../../core-modules/core-services/auth.service';

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
    {label: 'Transactions', path: '/portal', disabled: !this.isUserAllowed},
    {label: 'Addresses', path: '/addresses', disabled: !this.isUserAllowed},
    {label: 'Profile', path: '/profile', disabled: false},
  ];

  constructor(private authService: AuthService,
              private router: Router) {
  }

  private get isUserAllowed(): boolean {
    return this.user && this.user.account_type === 'agent' ? this.user.registration_finished : true;
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
