import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../feature-modules/auth/models';
import { AuthService } from '../../../core-modules/core-services/auth.service';
import { ProfileService } from '../../../core-modules/core-services/profile.service';
import { OfferService } from '../../../feature-modules/portal/services/offer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageKey } from '../../../core-modules/enums/local-storage-key';
import { Offer } from '../../../core-modules/models/offer';

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

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  user: User;

  offer: Offer;

  portalNavLinks: { label, path, disabled, hidden }[] = [];

  purchaseNavLinks: { label, path, progress, disabled }[] = [];

  isChildPage: boolean = false;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              public offerService: OfferService,
              private profileService: ProfileService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.offer = this.offerService.currentOffer;
    this.user = this.authService.currentUser;

    this.isChildPage = this.state !== 'portal';

    this.portalNavLinks = [
      {label: 'Agreements', path: '/portal/purchase-agreements/all', disabled: !this.user.registrationCompleted, hidden: false},
      {label: 'Transactions', path: '/portal/transactions', disabled: !this.user.registrationCompleted, hidden: false},
      {label: 'Addresses', path: '/addresses', disabled: !this.user.registrationCompleted, hidden: false},
      {label: 'Profile', path: '/profile', disabled: false, hidden: this.user.accountType === 'customer'},
    ];

    this.purchaseNavLinks = [
      {
        label: 'Step 1',
        path: [this.offer ? `./../../${this.offer.id}/step-one` : './../step-one'],
        progress: 1,
        disabled: false,
      },
      {label: 'Step 2', path: [`./../../${this.offer && this.offer.id}/step-two`], progress: 2, disabled: false},
      {label: 'Step 3', path: [`./../../${this.offer && this.offer.id}/step-three`], progress: 3, disabled: false},
      {label: 'Summary', path: [`./../../${this.offer && this.offer.id}/summary`], progress: 4, disabled: false},
    ];

    this.updatePurchaseLinks(this.offer);

    this.authService.userChanged$
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(() => {
        this.portalNavLinks.forEach((links) => links.disabled = !this.user.registrationCompleted);
      });

    this.offerService.offerChanged$
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: Offer) => {
        this.updatePurchaseLinks(data);
      });
  }

  closeOffer() {
    if (this.offerService.anonymousOfferData) {
      localStorage.removeItem(LocalStorageKey.Offer);
    }

    this.offerService.currentOffer = null;

    this.close.emit();
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  private updatePurchaseLinks(data: Offer) {
    this.purchaseNavLinks.forEach((link) => {
      link.disabled = (data && data.progress || 1) < link.progress;
    });
  }
}
