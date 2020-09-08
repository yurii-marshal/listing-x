import { Component, OnInit } from '@angular/core';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { AddressesService } from '../../../core-modules/core-services/addresses.service';
import { Address } from '../../../core-modules/models/address';
import { filter } from 'rxjs/operators';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core-modules/core-services/auth.service';

@Component({
  selector: 'app-addresses-list',
  templateUrl: './addresses-list.component.html',
  styleUrls: ['./addresses-list.component.scss']
})
export class AddressesListComponent implements OnInit {
  displayedColumns: string[] = ['createdAt', 'name', 'sellers', 'address', 'totalOffers', 'offersSigned', 'actions'];
  /* TODO: check address model depending addresses list response */
  dataSource: BaseTableDataSource<Address>;
  isAgent: boolean = this.authService.currentUser.accountType === 'agent';

  constructor(private service: AddressesService,
              private authService: AuthService,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    const isSelling = this.route.snapshot.queryParams.selling;
    if (isSelling) {
      this.openDialog();
    }

    this.dataSource = new BaseTableDataSource(this.service, null, null);
  }

  onCreate(): void {
    this.openDialog();
  }

  onEdit(item: Address): void {
    this.openDialog(item);
  }

  onDelete(item: Address): void {
    this.service.delete(item.id)
      .subscribe(() => this.dataSource.reload());
  }

  private openDialog(model?: Address): void {
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
