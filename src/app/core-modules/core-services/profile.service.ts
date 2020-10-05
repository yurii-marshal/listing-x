import { Injectable, Injector, OnDestroy } from '@angular/core';
import { ApiEndpoint } from '../enums/api-endpoints';
import { BaseDataService } from '../base-classes/base-data-service';
import { Agent } from '../models/agent';
import { Observable, of, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseDataService<Agent> implements OnDestroy {
  currentAgent: Agent;
  currentRouteUrl: string;
  previousRouteUrl: string;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    protected injector: Injector,
  ) {
    super(injector, ApiEndpoint.AgentProfile);

    this.router.events
      .pipe(
        takeUntil(this.onDestroyed$),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        this.previousRouteUrl = this.currentRouteUrl;
        this.currentRouteUrl = event.url;
      });
  }

  updateAgent(model: Agent): Observable<Agent> {
    return (this.http.put(ApiEndpoint.AgentProfile, model) as Observable<Agent>)
      .pipe(tap(() => this.currentAgent = model));
  }

  getAgent(): Observable<Agent> {
    return this.currentAgent ? of(this.currentAgent) :
      this.http.get(ApiEndpoint.AgentProfile) as Observable<Agent>;
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

}
