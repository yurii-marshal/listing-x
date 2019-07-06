import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core-modules/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-template',
  templateUrl: './base-template.component.html',
  styleUrls: ['./base-template.component.scss']
})
export class BaseTemplateComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
