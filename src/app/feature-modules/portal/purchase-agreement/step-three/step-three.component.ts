import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadDocumentType } from '../../../../core-modules/enums/upload-document-type';
import { UploadDocsModalType } from '../../../../core-modules/enums/upload-docs-modal-type';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentLinkingService } from '../../services/document-linking.service';
import { LinkedDocuments } from '../../../../core-modules/models/linked-documents';
import * as _ from 'lodash';
import { Offer } from '../../../../core-modules/models/offer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit, OnDestroy {
  offer: Offer;

  form: FormGroup;

  Type = UploadDocumentType;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(public route: ActivatedRoute,
              private service: DocumentLinkingService,
              private formBuilder: FormBuilder,
              private router: Router,
              private offerService: OfferService,
  ) {
  }

  get ModalTypes() {
    return UploadDocsModalType;
  }

  ngOnInit(): void {
    this.offerService.offerProgress = 3;

    this.form = this.formBuilder.group({
      preApproval: [[]],
      proofOfFunds: [[]],
      coverLetter: [[]],
    });

    this.offerService.getOfferById(+this.route.snapshot.params.id)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((offer: Offer) => {
        this.offer = offer;

        const model = _.pick(this.offer, Object.keys(this.form.controls));
        this.form.patchValue(model);
      });
  }

  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  getRequestValue(): LinkedDocuments {
    return {
      ...this.form.value,
      offerId: this.offer.id
    } as LinkedDocuments;
  }

  continue(): void {
    const model: LinkedDocuments = this.getRequestValue();
    // TODO: only do http request in case: form.dirty
    this.service.linkDocumentsToOffer(model)
      .subscribe(() => {
        this.router.navigate(['/portal/purchase-agreement/', this.offer.id, 'summary']);
      });
  }

  updateDocs(): void {
    const model: LinkedDocuments = this.getRequestValue();
    this.service.updateOfferDocuments(model).subscribe(() => {
      this.router.navigate(['/portal/transaction', this.offer.id]);
    });
  }

}
