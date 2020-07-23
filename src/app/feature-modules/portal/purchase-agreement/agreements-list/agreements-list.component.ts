import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Transaction, TransactionStatus } from '../../../../core-modules/models/transaction';
import { BaseTableDataSource } from '../../../../core-modules/datasources/base-table-data-source';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { OfferService } from '../../services/offer.service';

@Component({
  selector: 'app-agreements-list',
  templateUrl: './agreements-list.component.html',
  styleUrls: ['./agreements-list.component.scss']
})
export class AgreementsListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['createdAt', 'address', 'agentBuyers', 'agentSellers',
    'buyers', 'sellers', 'status', 'lastLogs', 'actions'];
  dataSource: BaseTableDataSource<Transaction>;

  private onDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private service: TransactionService,
    private offerService: OfferService,
  ) { }

  ngOnInit() {
    this.dataSource = new BaseTableDataSource(this.service, null, null);
  }

  ngAfterViewInit(): void {
    this.offerService.offerChanged$.pipe(
      takeUntil(this.onDestroyed$)
    ).subscribe(() => {
      this.dataSource.reload();
    });
  }


  ngOnDestroy() {
    this.onDestroyed$.next();
    this.onDestroyed$.complete();
  }

  onFilter(status: TransactionStatus) {
    let query = `status=${status}`;
    if (status === TransactionStatus.All) {
      query = '';
    }
    this.dataSource.filter = query;
  }

  getClassName(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.New:
        return 'blue';
      case TransactionStatus.InProgress:
        return 'yellow';
      case TransactionStatus.Finished:
        return 'green';
    }
  }

}
