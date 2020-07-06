import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { ProfileService } from '../../../core-modules/core-services/profile.service';
import { Agent } from '../../../core-modules/models/agent';

@Injectable()
export class AgentDataResolver implements Resolve<Agent> {

  constructor(private profileService: ProfileService,
              private snackBar: MatSnackBar) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Agent> | Agent {
    const config = {duration: 7000, panelClass: 'error-bar'};

    if (this.profileService.currentAgent) {
      return of(this.profileService.currentAgent);
    }

    return this.profileService.getAgent()
      .pipe(
        catchError(err => {
          this.snackBar.open(`Cannot retrieve agent.`, 'OK', config);
          return of(null);
        })
      );
  }
}
