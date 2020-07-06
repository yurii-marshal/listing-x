import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../feature-modules/auth/models';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { ProfileService } from '../../../core-modules/core-services/profile.service';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-base-template',
  templateUrl: './base-template.component.html',
  styleUrls: ['./base-template.component.scss']
})
export class BaseTemplateComponent implements OnInit, OnDestroy {
  @Input()
  isVisibleNavBar: boolean = true;

  @Input()
  state: string = 'portal';

  user: User;

  portalNavLinks: { label, path, disabled, hidden }[] = [];

  purchaseNavLinks: { label, path, progress, disabled }[] = [];

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              public offerService: OfferService,
              private profileService: ProfileService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    const offer = this.offerService.currentOffer;
    this.user = this.authService.currentUser;

    this.portalNavLinks = [
      {label: 'Transactions', path: '/portal', disabled: !this.user.registrationCompleted, hidden: false},
      {label: 'Addresses', path: '/addresses', disabled: !this.user.registrationCompleted, hidden: false},
      {label: 'Profile', path: '/profile', disabled: false, hidden: this.user.accountType === 'customer'},
    ];

    this.purchaseNavLinks = [
      {
        label: 'Step 1',
        path: [offer ? `./../../${offer.id}/step-one` : './../step-one'],
        progress: 1,
        disabled: false,
      },
      {label: 'Step 2', path: [`./../../${offer && offer.id}/step-two`], progress: 2, disabled: false},
      {label: 'Step 3', path: [`./../../${offer && offer.id}/step-three`], progress: 3, disabled: false},
      {label: 'Summary', path: [`./../../${offer && offer.id}/summary`], progress: 4, disabled: false},
    ];

    this.purchaseNavLinks.forEach((link) => {
      link.disabled = this.offerService.offerProgress < link.progress;
    });

    this.authService.changedUser$
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
      this.portalNavLinks.forEach((links) => links.disabled = !this.user.registrationCompleted);
    });
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
