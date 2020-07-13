import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../../../core-modules/models/offer';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditOfferDialogComponent } from '../../../../shared-modules/dialogs/edit-offer-dialog/edit-offer-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, skip, switchMap, takeUntil } from 'rxjs/operators';
import { forkJoin, fromEvent, Observable, of, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SaveOfferDialogComponent } from '../../../../shared-modules/dialogs/save-offer-dialog/save-offer-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
  providers: [DatePipe]
})
export class StepTwoComponent implements OnInit, OnDestroy {
  documentForm: FormGroup;
  currentPage: number = 0;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;
  isSideBarOpen: boolean;
  offerId: number;
  offer: Offer;

  private onDestroyed$: Subject<void> = new Subject<void>();

  private pageBreakersOffsetTop: number[];
  private documentFormEl: EventTarget;

  constructor(
    private offerService: OfferService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private elRef: ElementRef,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.offerService.offerProgress = 2;
    this.offerId = +this.route.snapshot.params.id;

    this.documentForm = this.fb.group({
      page_1: this.fb.group({
        check_civil_code: [null, []],
        check_disclosure_buyer_1: [null, []],
        check_disclosure_seller_1: [null, []],
        check_disclosure_landlord_1: [null, []],
        check_disclosure_tenant_1: [null, []],
        text_disclosure_role_name_1: ['', []],
        date_disclosure_1: ['', []],
        check_disclosure_buyer_2: [null, []],
        check_disclosure_seller_2: [null, []],
        check_disclosure_landlord_2: [null, []],
        check_disclosure_tenant_2: [null, []],
        text_disclosure_role_name_2: ['', []],
        date_disclosure_2: ['', []],
        text_disclosure_agent: ['', []],
        text_disclosure_agent_lic: ['', []],
        text_disclosure_seller: ['', []],
        text_disclosure_seller_lic: ['', []],
        date_disclosure_3: ['', []],
      }),
      page_2: this.fb.group({
        text_confirm_seller_firm_name: ['', []],
        text_confirm_seller_firm_lic: ['', []],
        check_confirm_seller_is_seller: [null, []],
        check_confirm_seller_is_dual_agent: [null, []],
        text_confirm_seller_agent_firm_name: ['', []],
        text_confirm_seller_agent_firm_lic: ['', []],
        check_confirm_seller_agent_is_seller: [null, []],
        check_confirm_seller_agent_is_dual_agent: [null, []],
        text_confirm_buyer_firm_name: ['', []],
        text_confirm_buyer_firm_lic: ['', []],
        check_confirm_buyer_is_buyer: [null, []],
        check_confirm_buyer_is_dual_agent: [null, []],
        text_confirm_buyer_agent_firm_name: ['', []],
        text_confirm_buyer_agent_firm_lic: ['', []],
        check_confirm_buyer_agent_is_seller: [null, []],
        check_confirm_buyer_agent_is_dual_agent: [null, []],
      }),
      page_3: this.fb.group({}),
      page_4: this.fb.group({}),
      page_5: this.fb.group({}),
      page_6: this.fb.group({}),
      page_7: this.fb.group({}),
      page_8: this.fb.group({}),
      page_9: this.fb.group({}),
      page_10: this.fb.group({}),
      page_11: this.fb.group({}),
      page_12: this.fb.group({}),
      page_13: this.fb.group({}),
      page_14: this.fb.group({}),
      page_15: this.fb.group({}),
      page_16: this.fb.group({}),
      // input35: ['', []],
      // input36: ['', []],
      // input37: ['', []],
      // input38: ['', []],
      // input39: ['', []],
      // input40: ['', []],
      // input41: ['', []],
      // input42: ['', []],
      // input43: ['', []],
      // input44: ['', []],
      // input45: ['', []],
      // input46: ['', []],
      // input47: ['', []],
      // input48: ['', []],
      // input49: ['', []],
      // input50: ['', []],
      // input51: ['', []],
      // input52: ['', []],
      // input53: ['', []],
      // input54: ['', []],
      // input55: ['', []],
      // input56: ['', []],
      // input57: ['', []],
      // input58: ['', []],
      // input59: ['', []],
      // input60: ['', []],
      // input61: ['', []],
      // input62: ['', []],
      // input63: ['', []],
      // input64: ['', []],
      // input65: ['', []],
      // input66: ['', []],
      // input67: ['', []],
      // input68: ['', []],
      // input69: ['', []],
      // input70: ['', []],
      // input71: ['', []],
      // input72: ['', []],
      // input73: ['', []],
      // input74: ['', []],
      // input75: ['', []],
      // input76: ['', []],
      // input77: ['', []],
      // input78: ['', []],
      // input79: ['', []],
      // input80: ['', []],
      // input81: ['', []],
      // input82: ['', []],
      // input83: ['', []],
      // input84: ['', []],
      // input85: ['', []],
      // input86: ['', []],
      // input87: ['', []],
      // input88: ['', []],
      // input89: ['', []],
      // input90: ['', []],
      // input91: ['', []],
      // input92: ['', []],
      // input93: ['', []],
      // input94: ['', []],
      // input95: ['', []],
      // input96: ['', []],
      // input97: ['', []],
      // input98: ['', []],
      // input99: ['', []],
      // input100: ['', []],
      // input101: ['', []],
      // input102: ['', []],
      // input103: ['', []],
      // input104: ['', []],
      // input105: ['', []],
      // input106: ['', []],
      // input107: ['', []],
      // input108: ['', []],
      // input109: ['', []],
      // input110: ['', []],
      // input111: ['', []],
      // input112: ['', []],
      // input113: ['', []],
      // input114: ['', []],
      // input115: ['', []],
      // input116: ['', []],
      // input117: ['', []],
      // input118: ['', []],
      // input119: ['', []],
      // input120: ['', []],
      // input121: ['', []],
      // input122: ['', []],
      // input123: ['', []],
      // input124: ['', []],
      // input125: ['', []],
      // input126: ['', []],
      // input127: ['', []],
      // input128: ['', []],
      // input129: ['', []],
      // input130: ['', []],
      // input131: ['', []],
      // input132: ['', []],
      // input133: ['', []],
      // input134: ['', []],
      // input135: ['', []],
      // input136: ['', []],
      // input137: ['', []],
      // input138: ['', []],
      // input139: ['', []],
      // input140: ['', []],
      // input141: ['', []],
      // input142: ['', []],
      // input143: ['', []],
      // input144: ['', []],
      // input145: ['', []],
      // input146: ['', []],
      // input147: ['', []],
      // input148: ['', []],
      // input149: ['', []],
      // input150: ['', []],
      // input151: ['', []],
      // input152: ['', []],
      // input153: ['', []],
      // input154: ['', []],
      // input155: ['', []],
      // input156: ['', []],
      // input157: ['', []],
      // input158: ['', []],
      // input159: ['', []],
      // input160: ['', []],
      // input161: ['', []],
      // input162: ['', []],
      // input163: ['', []],
      // input164: ['', []],
      // input165: ['', []],
      // input166: ['', []],
      // input167: ['', []],
      // input168: ['', []],
      // input169: ['', []],
      // input170: ['', []],
      // input171: ['', []],
      // input172: ['', []],
      // input173: ['', []],
      // input174: ['', []],
      // input175: ['', []],
      // input176: ['', []],
      // input177: ['', []],
      // input178: ['', []],
      // input179: ['', []],
      // input180: ['', []],
      // input181: ['', []],
      // input182: ['', []],
      // input183: ['', []],
      // input184: ['', []],
      // input185: ['', []],
      // input186: ['', []],
      // input187: ['', []],
      // input188: ['', []],
      // input189: ['', []],
      // input190: ['', []],
      // input191: ['', []],
      // input192: ['', []],
      // input193: ['', []],
      // input194: ['', []],
      // input195: ['', []],
      // input196: ['', []],
      // input197: ['', []],
      // input198: ['', []],
      // input199: ['', []],
      // input200: ['', []],
      // input201: ['', []],
      // input202: ['', []],
      // input203: ['', []],
      // input204: ['', []],
      // input205: ['', []],
      // input206: ['', []],
      // input207: ['', []],
      // input208: ['', []],
      // input209: ['', []],
      // input210: ['', []],
      // input211: ['', []],
      // input212: ['', []],
      // input213: ['', []],
      // input214: ['', []],
      // input215: ['', []],
      // input216: ['', []],
      // input217: ['', []],
      // input218: ['', []],
      // input219: ['', []],
      // input220: ['', []],
      // input221: ['', []],
      // input222: ['', []],
      // input223: ['', []],
      // input224: ['', []],
      // input225: ['', []],
      // input226: ['', []],
      // input227: ['', []],
      // input228: ['', []],
      // input229: ['', []],
      // input230: ['', []],
      // input231: ['', []],
      // input232: ['', []],
      // input233: ['', []],
      // input234: ['', []],
      // input235: ['', []],
      // input236: ['', []],
      // input237: ['', []],
      // input238: ['', []],
      // input239: ['', []],
      // input240: ['', []],
      // input241: ['', []],
      // input242: ['', []],
      // input243: ['', []],
      // input244: ['', []],
      // input245: ['', []],
      // input246: ['', []],
      // input247: ['', []],
      // input248: ['', []],
      // input249: ['', []],
      // input250: ['', []],
      // input251: ['', []],
      // input252: ['', []],
      // input253: ['', []],
      // input254: ['', []],
      // input255: ['', []],
      // input256: ['', []],
      // input257: ['', []],
      // input258: ['', []],
      // input259: ['', []],
      // input260: ['', []],
      // input261: ['', []],
      // input262: ['', []],
      // input263: ['', []],
      // input264: ['', []],
      // input265: ['', []],
      // input266: ['', []],
      // input267: ['', []],
      // input268: ['', []],
      // input269: ['', []],
      // input270: ['', []],
      // input271: ['', []],
      // input272: ['', []],
      // input273: ['', []],
      // input274: ['', []],
      // input275: ['', []],
      // input276: ['', []],
      // input277: ['', []],
      // input278: ['', []],
      // input279: ['', []],
      // input280: ['', []],
      // input281: ['', []],
      // input282: ['', []],
      // input283: ['', []],
      // input284: ['', []],
      // input285: ['', []],
      // input286: ['', []],
      // input287: ['', []],
      // input288: ['', []],
      // input289: ['', []],
      // input290: ['', []],
      // input291: ['', []],
      // input292: ['', []],
      // input293: ['', []],
      // input294: ['', []],
      // input295: ['', []],
      // input296: ['', []],
      // input297: ['', []],
      // input298: ['', []],
      // input299: ['', []],
      // input300: ['', []],
      // input301: ['', []],
      // input302: ['', []],
      // input303: ['', []],
      // input304: ['', []],
      // input305: ['', []],
      // input306: ['', []],
      // input307: ['', []],
      // input308: ['', []],
      // input309: ['', []],
      // input310: ['', []],
      // input311: ['', []],
      // input312: ['', []],
      // input313: ['', []],
      // input314: ['', []],
      // input315: ['', []],
      // input316: ['', []],
      // input317: ['', []],
      // input318: ['', []],
      // input319: ['', []],
      // input320: ['', []],
      // input321: ['', []],
      // input322: ['', []],
      // input323: ['', []],
      // input324: ['', []],
      // input325: ['', []],
      // input326: ['', []],
      // input327: ['', []],
      // input328: ['', []],
      // input329: ['', []],
      // input330: ['', []],
      // input331: ['', []],
      // input332: ['', []],
      // input333: ['', []],
      // input334: ['', []],
      // input335: ['', []],
      // input336: ['', []],
      // input337: ['', []],
      // input338: ['', []],
      // input339: ['', []],
      // input340: ['', []],
      // input341: ['', []],
      // input342: ['', []],
      // input343: ['', []],
      // input344: ['', []],
      // input345: ['', []],
      // input346: ['', []],
      // input347: ['', []],
      // input348: ['', []],
      // input349: ['', []],
      // input350: ['', []],
      // input351: ['', []],
      // input352: ['', []],
      // input353: ['', []],
      // input354: ['', []],
      // input355: ['', []],
      // input356: ['', []],
      // input357: ['', []],
      // input358: ['', []],
      // input359: ['', []],
      // input360: ['', []],
      // input361: ['', []],
      // input362: ['', []],
      // input363: ['', []],
      // input364: ['', []],
      // input365: ['', []],
      // input366: ['', []],
      // input367: ['', []],
      // input368: ['', []],
      // input369: ['', []],
      // input370: ['', []],
      // input371: ['', []],
      // input372: ['', []],
      // input373: ['', []],
      // input374: ['', []],
      // input375: ['', []],
      // input376: ['', []],
      // input377: ['', []],
      // input378: ['', []],
      // input379: ['', []],
      // input380: ['', []],
      // input381: ['', []],
      // input382: ['', []],
      // input383: ['', []],
      // input384: ['', []],
      // input385: ['', []],
      // input386: ['', []],
      // input387: ['', []],
      // input388: ['', []],
      // input389: ['', []],
      // input390: ['', []],
      // input391: ['', []],
      // input392: ['', []],
      // input393: ['', []],
      // input394: ['', []],
      // input395: ['', []],
      // input396: ['', []],
      // input397: ['', []],
      // input398: ['', []],
      // input399: ['', []],
      // input400: ['', []],
      // input401: ['', []],
      // input402: ['', []],
      // input403: ['', []],
      // input404: ['', []],
      // input405: ['', []],
      // input406: ['', []],
      // input407: ['', []],
      // input408: ['', []],
      // input409: ['', []],
      // input410: ['', []],
      // input411: ['', []],
      // input412: ['', []],
      // input413: ['', []],
      // input414: ['', []],
      // input415: ['', []],
    }, {updateOn: 'blur'});

    forkJoin(
      this.offerService.getOfferById(this.offerId),
      this.offerService.getOfferDocument(this.offerId)
    )
      .pipe(
        takeUntil(this.onDestroyed$)
      )
      .subscribe(([offer, doc]) => {
        this.offer = offer;

        this.documentForm.patchValue(doc);
      });

    this.initPageBreakers();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  detectPageChange(currentScrollPosition: number) {
    for (let i = 0; i < this.pageBreakersOffsetTop.length; i++) {
      if (this.pageBreakersOffsetTop[i + 1]) {
        if (currentScrollPosition >= this.pageBreakersOffsetTop[i] && currentScrollPosition < this.pageBreakersOffsetTop[i + 1]) {
          this.currentPage = i;
          break;
        }
      }

      this.currentPage = i;
    }
  }

  subscribeToFormChanges() {
    this.documentForm.valueChanges
      .pipe(
        takeUntil(this.onDestroyed$),
        skip(1),
        switchMap(() => of(this.getDirtyFields(this.documentForm)))
      )
      .subscribe((formValues) => {
        this.documentInputChanged(formValues);
      });
  }

  documentInputChanged(formValues) {
    this.offerService.updateOfferDocumentField(this.offerId, formValues)
      .pipe(
        takeUntil(this.onDestroyed$)
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  initPageBreakers() {
    this.pageBreakersOffsetTop = Array.from(this.elRef.nativeElement.querySelectorAll('.page-breaker'))
      .map((item: any) => item.offsetTop);

    this.documentFormEl = this.elRef.nativeElement.getElementsByClassName('doc-container')[0];

    fromEvent(this.documentFormEl, 'scroll')
      .pipe(
        debounceTime(300),
        takeUntil(this.onDestroyed$)
      )
      .subscribe((event: any) => {
        this.detectPageChange(event.target.scrollTop);
      });
  }

  editOffer(offerChangedModel?: Offer) {
    const dialogRef = this.dialog.open(EditOfferDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {offer: offerChangedModel || this.offer}
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: any) => {
        if (data.saved) {
          this.snackbar.open('Offer is updated');
        }
        if (data.requestToSave) {
          this.openSaveOfferDialog(data.changedOfferModel);
        }
      });
  }

  // saveDocument(formValue) {
  //   this.offerService.updateOfferDocument(this.offerId, formValue)
  //     .pipe(
  //       takeUntil(this.onDestroyed$)
  //     )
  //     .subscribe((res) => {
  //       // console.log(res);
  //     });
  // }

  openSaveOfferDialog(changedOfferModel: Offer) {
    const dialogRef = this.dialog.open(SaveOfferDialogComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe((data: any) => {
        if (data) {
          if (data.saveAndClose) {
            this.saveOffer(changedOfferModel)
              .pipe(takeUntil(this.onDestroyed$))
              .subscribe((model: Offer) => {
                this.offer = model;
              });
          } else if (data.discard) {
            this.offer = this.offerService.currentOffer;
          } else if (data.reopen) {
            this.editOffer(changedOfferModel);
          }
        }
      });
  }

  saveOffer(model: Offer): Observable<Offer> {
    return this.offerService.update(model);
  }

  acceptOfferPDF() {
    this.router.navigate([`portal/purchase-agreement/${this.offer.id}/step-three`]);
  }

  private getDirtyFields(group: FormGroup) {
    let changedProperties = {};

    Object.keys(group.controls).forEach((name) => {
      const currentControl = group.controls[name];

      if (currentControl.dirty) {
        changedProperties = currentControl instanceof FormGroup
          ? this.getDirtyFields(currentControl)
          : {
            ...changedProperties,
            ...{
              [name]: (currentControl.value instanceof Date
                ? this.transformDate(currentControl.value)
                : currentControl.value)
            }
          };
      }
    });

    return changedProperties;
  }

  private transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}
