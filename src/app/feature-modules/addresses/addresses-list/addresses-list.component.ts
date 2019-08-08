import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { AddressesService } from '../../../core-modules/core-services/addresses.service';
import { Address } from '../../../core-modules/models/address';
import { filter, switchMap, tap } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { ConfirmationBarComponent } from '../../../shared-modules/components/confirmation-bar/confirmation-bar.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addresses-list',
  templateUrl: './addresses-list.component.html',
  styleUrls: ['./addresses-list.component.scss']
})
export class AddressesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['createdAt', 'name', 'address', 'offersCreated', 'offersSigned', 'actions'];

  dataSource: BaseTableDataSource<Address>;

  constructor(private cdr: ChangeDetectorRef,
              private service: AddressesService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    const isSelling = this.route.snapshot.queryParams.selling;
    if (isSelling) {
      this.openDialog();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource = new BaseTableDataSource(this.service, null, null);
    this.cdr.detectChanges();
  }

  onCreate() {
    this.openDialog();
  }

  onEdit(item: Address) {
    this.openDialog(item);
  }


  onDelete(item: Address) {
    const config = {
      data: {
        message: 'Are you sure want to delete?',
        dismiss: 'Cancel'
      },
      duration: 0
    };
    const snackBarRef = this.snackbar.openFromComponent(ConfirmationBarComponent, config);
    snackBarRef.onAction()
      .pipe(
        switchMap(() => this.service.delete(item.id)),
        tap(() => this.snackbar.open('Successfully deleted item.'))
      )
      .subscribe(() => this.dataSource.reload());
  }

  private openDialog(model?: Address) {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {model: model}
    });

    dialogRef.afterClosed()
      .pipe(filter(dialogResult => !!dialogResult))
      .subscribe(() => this.dataSource.reload());
  }
}
