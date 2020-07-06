import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../../../core-modules/models/offer';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditOfferDialogComponent } from '../../../../shared-modules/dialogs/edit-offer-dialog/edit-offer-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaveOfferDialogComponent } from '../../../../shared-modules/dialogs/save-offer-dialog/save-offer-dialog.component';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit, OnDestroy {
  documentForm: FormGroup;
  currentPage: number = 0;
  completedFieldsCount: number = 0;
  allFieldsCount: number = 0;
  isSideBarOpen: boolean;
  offerId: number;
  offer: Offer;
  documentPA = {
    pages: [
      {
        fields: []
      }
    ],
  };
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
    private elRef: ElementRef
  ) {
  }

  ngOnInit() {
    this.offerService.offerProgress = 2;
    this.offerId = +this.route.snapshot.params.id;

    this.documentForm = this.fb.group({
      input0: ['', [Validators.required]],
      input1: ['', [Validators.required]],
      input2: ['', [Validators.required]],
      input3: ['', [Validators.required]],
      input4: ['', [Validators.required]],
      input5: ['', [Validators.required]],
      input6: ['', [Validators.required]],
      input7: ['', [Validators.required]],
      input8: ['', [Validators.required]],
      input9: ['', [Validators.required]],
      input10: ['', [Validators.required]],
      input11: ['', [Validators.required]],
      input12: ['', [Validators.required]],
      input13: ['', [Validators.required]],
      input14: ['', [Validators.required]],
      input15: ['', [Validators.required]],
      input16: ['', [Validators.required]],
      input17: ['', [Validators.required]],
      input18: ['', [Validators.required]],
      input19: ['', [Validators.required]],
      input20: ['', [Validators.required]],
      input21: ['', [Validators.required]],
      input22: ['', [Validators.required]],
      input23: ['', [Validators.required]],
      input24: ['', [Validators.required]],
      input25: ['', [Validators.required]],
      input26: ['', [Validators.required]],
      input27: ['', [Validators.required]],
      input28: ['', [Validators.required]],
      input29: ['', [Validators.required]],
      input30: ['', [Validators.required]],
      input31: ['', [Validators.required]],
      input32: ['', [Validators.required]],
      input33: ['', [Validators.required]],
      input34: ['', [Validators.required]],
      input35: ['', [Validators.required]],
      input36: ['', [Validators.required]],
      input37: ['', [Validators.required]],
      input38: ['', [Validators.required]],
      input39: ['', [Validators.required]],
      input40: ['', [Validators.required]],
      input41: ['', [Validators.required]],
      input42: ['', [Validators.required]],
      input43: ['', [Validators.required]],
      input44: ['', [Validators.required]],
      input45: ['', [Validators.required]],
      input46: ['', [Validators.required]],
      input47: ['', [Validators.required]],
      input48: ['', [Validators.required]],
      input49: ['', [Validators.required]],
      input50: ['', [Validators.required]],
      input51: ['', [Validators.required]],
      input52: ['', [Validators.required]],
      input53: ['', [Validators.required]],
      input54: ['', [Validators.required]],
      input55: ['', [Validators.required]],
      input56: ['', [Validators.required]],
      input57: ['', [Validators.required]],
      input58: ['', [Validators.required]],
      input59: ['', [Validators.required]],
      input60: ['', [Validators.required]],
      input61: ['', [Validators.required]],
      input62: ['', [Validators.required]],
      input63: ['', [Validators.required]],
      input64: ['', [Validators.required]],
      input65: ['', [Validators.required]],
      input66: ['', [Validators.required]],
      input67: ['', [Validators.required]],
      input68: ['', [Validators.required]],
      input69: ['', [Validators.required]],
      input70: ['', [Validators.required]],
      input71: ['', [Validators.required]],
      input72: ['', [Validators.required]],
      input73: ['', [Validators.required]],
      input74: ['', [Validators.required]],
      input75: ['', [Validators.required]],
      input76: ['', [Validators.required]],
      input77: ['', [Validators.required]],
      input78: ['', [Validators.required]],
      input79: ['', [Validators.required]],
      input80: ['', [Validators.required]],
      input81: ['', [Validators.required]],
      input82: ['', [Validators.required]],
      input83: ['', [Validators.required]],
      input84: ['', [Validators.required]],
      input85: ['', [Validators.required]],
      input86: ['', [Validators.required]],
      input87: ['', [Validators.required]],
      input88: ['', [Validators.required]],
      input89: ['', [Validators.required]],
      input90: ['', [Validators.required]],
      input91: ['', [Validators.required]],
      input92: ['', [Validators.required]],
      input93: ['', [Validators.required]],
      input94: ['', [Validators.required]],
      input95: ['', [Validators.required]],
      input96: ['', [Validators.required]],
      input97: ['', [Validators.required]],
      input98: ['', [Validators.required]],
      input99: ['', [Validators.required]],
      input100: ['', [Validators.required]],
      input101: ['', [Validators.required]],
      input102: ['', [Validators.required]],
      input103: ['', [Validators.required]],
      input104: ['', [Validators.required]],
      input105: ['', [Validators.required]],
      input106: ['', [Validators.required]],
      input107: ['', [Validators.required]],
      input108: ['', [Validators.required]],
      input109: ['', [Validators.required]],
      input110: ['', [Validators.required]],
      input111: ['', [Validators.required]],
      input112: ['', [Validators.required]],
      input113: ['', [Validators.required]],
      input114: ['', [Validators.required]],
      input115: ['', [Validators.required]],
      input116: ['', [Validators.required]],
      input117: ['', [Validators.required]],
      input118: ['', [Validators.required]],
      input119: ['', [Validators.required]],
      input120: ['', [Validators.required]],
      input121: ['', [Validators.required]],
      input122: ['', [Validators.required]],
      input123: ['', [Validators.required]],
      input124: ['', [Validators.required]],
      input125: ['', [Validators.required]],
      input126: ['', [Validators.required]],
      input127: ['', [Validators.required]],
      input128: ['', [Validators.required]],
      input129: ['', [Validators.required]],
      input130: ['', [Validators.required]],
      input131: ['', [Validators.required]],
      input132: ['', [Validators.required]],
      input133: ['', [Validators.required]],
      input134: ['', [Validators.required]],
      input135: ['', [Validators.required]],
      input136: ['', [Validators.required]],
      input137: ['', [Validators.required]],
      input138: ['', [Validators.required]],
      input139: ['', [Validators.required]],
      input140: ['', [Validators.required]],
      input141: ['', [Validators.required]],
      input142: ['', [Validators.required]],
      input143: ['', [Validators.required]],
      input144: ['', [Validators.required]],
      input145: ['', [Validators.required]],
      input146: ['', [Validators.required]],
      input147: ['', [Validators.required]],
      input148: ['', [Validators.required]],
      input149: ['', [Validators.required]],
      input150: ['', [Validators.required]],
      input151: ['', [Validators.required]],
      input152: ['', [Validators.required]],
      input153: ['', [Validators.required]],
      input154: ['', [Validators.required]],
      input155: ['', [Validators.required]],
      input156: ['', [Validators.required]],
      input157: ['', [Validators.required]],
      input158: ['', [Validators.required]],
      input159: ['', [Validators.required]],
      input160: ['', [Validators.required]],
      input161: ['', [Validators.required]],
      input162: ['', [Validators.required]],
      input163: ['', [Validators.required]],
      input164: ['', [Validators.required]],
      input165: ['', [Validators.required]],
      input166: ['', [Validators.required]],
      input167: ['', [Validators.required]],
      input168: ['', [Validators.required]],
      input169: ['', [Validators.required]],
      input170: ['', [Validators.required]],
      input171: ['', [Validators.required]],
      input172: ['', [Validators.required]],
      input173: ['', [Validators.required]],
      input174: ['', [Validators.required]],
      input175: ['', [Validators.required]],
      input176: ['', [Validators.required]],
      input177: ['', [Validators.required]],
      input178: ['', [Validators.required]],
      input179: ['', [Validators.required]],
      input180: ['', [Validators.required]],
      input181: ['', [Validators.required]],
      input182: ['', [Validators.required]],
      input183: ['', [Validators.required]],
      input184: ['', [Validators.required]],
      input185: ['', [Validators.required]],
      input186: ['', [Validators.required]],
      input187: ['', [Validators.required]],
      input188: ['', [Validators.required]],
      input189: ['', [Validators.required]],
      input190: ['', [Validators.required]],
      input191: ['', [Validators.required]],
      input192: ['', [Validators.required]],
      input193: ['', [Validators.required]],
      input194: ['', [Validators.required]],
      input195: ['', [Validators.required]],
      input196: ['', [Validators.required]],
      input197: ['', [Validators.required]],
      input198: ['', [Validators.required]],
      input199: ['', [Validators.required]],
      input200: ['', [Validators.required]],
      input201: ['', [Validators.required]],
      input202: ['', [Validators.required]],
      input203: ['', [Validators.required]],
      input204: ['', [Validators.required]],
      input205: ['', [Validators.required]],
      input206: ['', [Validators.required]],
      input207: ['', [Validators.required]],
      input208: ['', [Validators.required]],
      input209: ['', [Validators.required]],
      input210: ['', [Validators.required]],
      input211: ['', [Validators.required]],
      input212: ['', [Validators.required]],
      input213: ['', [Validators.required]],
      input214: ['', [Validators.required]],
      input215: ['', [Validators.required]],
      input216: ['', [Validators.required]],
      input217: ['', [Validators.required]],
      input218: ['', [Validators.required]],
      input219: ['', [Validators.required]],
      input220: ['', [Validators.required]],
      input221: ['', [Validators.required]],
      input222: ['', [Validators.required]],
      input223: ['', [Validators.required]],
      input224: ['', [Validators.required]],
      input225: ['', [Validators.required]],
      input226: ['', [Validators.required]],
      input227: ['', [Validators.required]],
      input228: ['', [Validators.required]],
      input229: ['', [Validators.required]],
      input230: ['', [Validators.required]],
      input231: ['', [Validators.required]],
      input232: ['', [Validators.required]],
      input233: ['', [Validators.required]],
      input234: ['', [Validators.required]],
      input235: ['', [Validators.required]],
      input236: ['', [Validators.required]],
      input237: ['', [Validators.required]],
      input238: ['', [Validators.required]],
      input239: ['', [Validators.required]],
      input240: ['', [Validators.required]],
      input241: ['', [Validators.required]],
      input242: ['', [Validators.required]],
      input243: ['', [Validators.required]],
      input244: ['', [Validators.required]],
      input245: ['', [Validators.required]],
      input246: ['', [Validators.required]],
      input247: ['', [Validators.required]],
      input248: ['', [Validators.required]],
      input249: ['', [Validators.required]],
      input250: ['', [Validators.required]],
      input251: ['', [Validators.required]],
      input252: ['', [Validators.required]],
      input253: ['', [Validators.required]],
      input254: ['', [Validators.required]],
      input255: ['', [Validators.required]],
      input256: ['', [Validators.required]],
      input257: ['', [Validators.required]],
      input258: ['', [Validators.required]],
      input259: ['', [Validators.required]],
      input260: ['', [Validators.required]],
      input261: ['', [Validators.required]],
      input262: ['', [Validators.required]],
      input263: ['', [Validators.required]],
      input264: ['', [Validators.required]],
      input265: ['', [Validators.required]],
      input266: ['', [Validators.required]],
      input267: ['', [Validators.required]],
      input268: ['', [Validators.required]],
      input269: ['', [Validators.required]],
      input270: ['', [Validators.required]],
      input271: ['', [Validators.required]],
      input272: ['', [Validators.required]],
      input273: ['', [Validators.required]],
      input274: ['', [Validators.required]],
      input275: ['', [Validators.required]],
      input276: ['', [Validators.required]],
      input277: ['', [Validators.required]],
      input278: ['', [Validators.required]],
      input279: ['', [Validators.required]],
      input280: ['', [Validators.required]],
      input281: ['', [Validators.required]],
      input282: ['', [Validators.required]],
      input283: ['', [Validators.required]],
      input284: ['', [Validators.required]],
      input285: ['', [Validators.required]],
      input286: ['', [Validators.required]],
      input287: ['', [Validators.required]],
      input288: ['', [Validators.required]],
      input289: ['', [Validators.required]],
      input290: ['', [Validators.required]],
      input291: ['', [Validators.required]],
      input292: ['', [Validators.required]],
      input293: ['', [Validators.required]],
      input294: ['', [Validators.required]],
      input295: ['', [Validators.required]],
      input296: ['', [Validators.required]],
      input297: ['', [Validators.required]],
      input298: ['', [Validators.required]],
      input299: ['', [Validators.required]],
      input300: ['', [Validators.required]],
      input301: ['', [Validators.required]],
      input302: ['', [Validators.required]],
      input303: ['', [Validators.required]],
      input304: ['', [Validators.required]],
      input305: ['', [Validators.required]],
      input306: ['', [Validators.required]],
      input307: ['', [Validators.required]],
      input308: ['', [Validators.required]],
      input309: ['', [Validators.required]],
      input310: ['', [Validators.required]],
      input311: ['', [Validators.required]],
      input312: ['', [Validators.required]],
      input313: ['', [Validators.required]],
      input314: ['', [Validators.required]],
      input315: ['', [Validators.required]],
      input316: ['', [Validators.required]],
      input317: ['', [Validators.required]],
      input318: ['', [Validators.required]],
      input319: ['', [Validators.required]],
      input320: ['', [Validators.required]],
      input321: ['', [Validators.required]],
      input322: ['', [Validators.required]],
      input323: ['', [Validators.required]],
      input324: ['', [Validators.required]],
      input325: ['', [Validators.required]],
      input326: ['', [Validators.required]],
      input327: ['', [Validators.required]],
      input328: ['', [Validators.required]],
      input329: ['', [Validators.required]],
      input330: ['', [Validators.required]],
      input331: ['', [Validators.required]],
      input332: ['', [Validators.required]],
      input333: ['', [Validators.required]],
      input334: ['', [Validators.required]],
      input335: ['', [Validators.required]],
      input336: ['', [Validators.required]],
      input337: ['', [Validators.required]],
      input338: ['', [Validators.required]],
      input339: ['', [Validators.required]],
      input340: ['', [Validators.required]],
      input341: ['', [Validators.required]],
      input342: ['', [Validators.required]],
      input343: ['', [Validators.required]],
      input344: ['', [Validators.required]],
      input345: ['', [Validators.required]],
      input346: ['', [Validators.required]],
      input347: ['', [Validators.required]],
      input348: ['', [Validators.required]],
      input349: ['', [Validators.required]],
      input350: ['', [Validators.required]],
      input351: ['', [Validators.required]],
      input352: ['', [Validators.required]],
      input353: ['', [Validators.required]],
      input354: ['', [Validators.required]],
      input355: ['', [Validators.required]],
      input356: ['', [Validators.required]],
      input357: ['', [Validators.required]],
      input358: ['', [Validators.required]],
      input359: ['', [Validators.required]],
      input360: ['', [Validators.required]],
      input361: ['', [Validators.required]],
      input362: ['', [Validators.required]],
      input363: ['', [Validators.required]],
      input364: ['', [Validators.required]],
      input365: ['', [Validators.required]],
      input366: ['', [Validators.required]],
      input367: ['', [Validators.required]],
      input368: ['', [Validators.required]],
      input369: ['', [Validators.required]],
      input370: ['', [Validators.required]],
      input371: ['', [Validators.required]],
      input372: ['', [Validators.required]],
      input373: ['', [Validators.required]],
      input374: ['', [Validators.required]],
      input375: ['', [Validators.required]],
      input376: ['', [Validators.required]],
      input377: ['', [Validators.required]],
      input378: ['', [Validators.required]],
      input379: ['', [Validators.required]],
      input380: ['', [Validators.required]],
      input381: ['', [Validators.required]],
      input382: ['', [Validators.required]],
      input383: ['', [Validators.required]],
      input384: ['', [Validators.required]],
      input385: ['', [Validators.required]],
      input386: ['', [Validators.required]],
      input387: ['', [Validators.required]],
      input388: ['', [Validators.required]],
      input389: ['', [Validators.required]],
      input390: ['', [Validators.required]],
      input391: ['', [Validators.required]],
      input392: ['', [Validators.required]],
      input393: ['', [Validators.required]],
      input394: ['', [Validators.required]],
      input395: ['', [Validators.required]],
      input396: ['', [Validators.required]],
      input397: ['', [Validators.required]],
      input398: ['', [Validators.required]],
      input399: ['', [Validators.required]],
      input400: ['', [Validators.required]],
      input401: ['', [Validators.required]],
      input402: ['', [Validators.required]],
      input403: ['', [Validators.required]],
      input404: ['', [Validators.required]],
      input405: ['', [Validators.required]],
      input406: ['', [Validators.required]],
      input407: ['', [Validators.required]],
      input408: ['', [Validators.required]],
      input409: ['', [Validators.required]],
      input410: ['', [Validators.required]],
      input411: ['', [Validators.required]],
      input412: ['', [Validators.required]],
      input413: ['', [Validators.required]],
      input414: ['', [Validators.required]],
      input415: ['', [Validators.required]],
    });

    this.offerService.getOfferById(this.offerId)
      .pipe(
        takeUntil(this.onDestroyed$)
      )
      .subscribe((offer: Offer) => {
        this.offer = offer;
      });

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
                this.snackbar.open('Offer is updated');
              });
          }
          if (data.discard) {
            this.offer = this.offerService.currentOffer;
          }
          if (data.reopen) {
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

}
