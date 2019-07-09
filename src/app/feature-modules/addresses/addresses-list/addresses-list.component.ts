import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { AddressesService } from '../addresses.service';
import { Address } from '../../model';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddressDialogComponent } from '../../../shared-modules/dialogs/address-dialog/address-dialog.component';

@Component({
  selector: 'app-addresses-list',
  templateUrl: './addresses-list.component.html',
  styleUrls: ['./addresses-list.component.scss']
})
export class AddressesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'name', 'address', 'offersCreated', 'offersSigned', 'actions'];

  dataSource: BaseTableDataSource<Address>;

  constructor(private cdr: ChangeDetectorRef,
              private dataService: AddressesService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.dataSource = new BaseTableDataSource(this.dataService, null, null);
    this.cdr.detectChanges();
  }

  onCreate(isEdit: boolean) {
    this.openDialog();
  }

  onEdit(item: Address) {
    this.openDialog(item);
  }

  onCopyLink(link: string): void {
    // TODO:
  }

  onDelete(id: number) {
    this.dataService.delete(id)
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
          ? this.dataService.update(item)
          : this.dataService.add(item)
        )
      )
      .subscribe(() => this.dataSource.reload());
  }

}
