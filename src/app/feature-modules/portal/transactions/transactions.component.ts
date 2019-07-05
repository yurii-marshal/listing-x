import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoint } from '../../../core-modules/enums/auth-endpoints';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
    this.http.get<boolean>(ApiEndpoint.CurrentUser).subscribe();
    // this.router.navigate(['/portal'], {queryParams: {param: new Date().getTime()}});
  }

}
