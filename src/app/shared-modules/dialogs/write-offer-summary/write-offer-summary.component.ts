import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-write-offer-summary',
  templateUrl: './write-offer-summary.component.html',
  styleUrls: ['./write-offer-summary.component.scss']
})
export class WriteOfferSummaryComponent implements OnInit {
  get backLink(): string {
    return 'TODO:';
  }

  constructor() { }

  ngOnInit() {
  }

  close() {
    // const model: LinkedDocuments = this.form.value;
    // model.offerId = this.data.model.offerId;
    // this.service.linkDocumentsToOffer(model)
    //   .subscribe(() => {
    //     this.dialogRef.close(model);
    //     this.router.navigate([this.nextLink]);
    //   });
  }

}
