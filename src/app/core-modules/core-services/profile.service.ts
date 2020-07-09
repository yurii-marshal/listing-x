import { Injectable, Injector } from '@angular/core';
import { ApiEndpoint } from '../enums/api-endpoints';
import { BaseDataService } from '../base-classes/base-data-service';
import { Agent } from '../models/agent';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseDataService<Agent> {
  currentAgent: Agent;

  constructor(
    protected injector: Injector,
    private authService: AuthService,
  ) {
    super(injector, ApiEndpoint.AgentProfile);
  }

  changeUserProps(props) {
    this.authService.updateUser(props);
  }

  updateAgent(model: Agent): Observable<Agent> {
    return (this.http.put(ApiEndpoint.AgentProfile, model) as Observable<Agent>)
      .pipe(tap(() => this.currentAgent = model));
  }

  getAgent(): Observable<Agent> {
      return this.http.get(ApiEndpoint.AgentProfile) as Observable<Agent>;
  }

}
