import { Injectable, Injector } from '@angular/core';
import { ApiEndpoint } from '../enums/api-endpoints';
import { BaseDataService } from '../base-classes/base-data-service';
import { Agent } from '../models/agent';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseDataService<Agent> {
  currentAgent: Agent;

  constructor(
    protected injector: Injector,
    protected http: HttpClient,
    private authService: AuthService,
    ) {
    super(injector, ApiEndpoint.AgentProfile);
  }

  changeUserProps(props) {
    this.authService.changeUser(props);
  }

  updateAgent(model: Agent): Observable<Agent> {
    return this.http.put(ApiEndpoint.AgentProfile, model) as Observable<Agent>;
  }

  getAgent(): Observable<Agent> {
    return this.http.get(ApiEndpoint.AgentProfile) as Observable<Agent>;
  }

}
