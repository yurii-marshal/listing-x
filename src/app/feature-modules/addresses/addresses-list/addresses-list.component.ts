import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { AddressesService } from '../addresses.service';
import { Address } from '../../model';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { ConfirmationBarComponent } from '../../../shared-modules/components/confirmation-bar/confirmation-bar.component';

@Component({
  selector: 'app-addresses-list',
  templateUrl: './addresses-list.component.html',
  styleUrls: ['./addresses-list.component.scss']
})
export class AddressesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'name', 'address', 'offersCreated', 'offersSigned', 'actions'];

  dataSource: BaseTableDataSource<Address>;

  constructor(private cdr: ChangeDetectorRef,
              private service: AddressesService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar) {
  }

  ngOnInit() {
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

  onCopyLink(link: string): void {
    // TODO: redirection
  }

  onDelete(item: Address) {
    const config = {
      data: {
        message: 'Are you sure want to delete?',
        dismiss: 'Cancel'
      }
    };
    const snackBarRef = this.snackbar.openFromComponent(ConfirmationBarComponent, config);
    snackBarRef.onAction()
      .pipe(
        switchMap(() => this.service.delete(item.id)),
        tap(() => this.snackbar.open('Successfully deleted address', 'OK', {duration: 3000}))
      )
      .subscribe(() => this.dataSource.reload());
  }

  private openDialog(model?: Address) {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '600px',
      data: {model: model || new Address()}
    });

    const isEdit: boolean = !!model;
    dialogRef.afterClosed()
      .pipe(
        switchMap((item: Address) => isEdit
          ? this.service.update(item)
          : this.service.add(item)
        )
      )
      .subscribe(() => this.dataSource.reload());
  }

}
