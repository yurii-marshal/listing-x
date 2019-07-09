import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core-modules/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../feature-modules/auth/models';

@Component({
  selector: 'app-base-template',
  templateUrl: './base-template.component.html',
  styleUrls: ['./base-template.component.scss']
})
export class BaseTemplateComponent implements OnInit{
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
