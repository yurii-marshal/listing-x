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

  @Input()
  state: string = 'portal';

  navLinks: { label, path }[] = [
    {label: 'Transactions', path: '/portal'},
    {label: 'Addresses', path: '/addresses'}
  ];

  user: User;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
