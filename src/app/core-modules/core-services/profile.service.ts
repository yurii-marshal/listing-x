import { Injectable, Injector } from '@angular/core';
import { ApiEndpoint } from '../enums/api-endpoints';
import { BaseDataService } from '../base-classes/base-data-service';
import { Agent } from '../models/agent';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseDataService<Agent> {

  constructor(protected injector: Injector, protected http: HttpClient) {
    super(injector, ApiEndpoint.AgentProfile);
  }

  updateAgent(model: Agent): Observable<Agent> {
    return this.http.put(ApiEndpoint.AgentProfile, model) as Observable<Agent>;
  }

  getAgent(): Observable<Agent> {
    return this.http.get(ApiEndpoint.AgentProfile) as Observable<Agent>;
  }

}
