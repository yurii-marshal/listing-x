import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { AddressesService } from '../addresses.service';
import { Address } from '../../model';
import { switchMap } from 'rxjs/operators';
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
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.dataSource = new BaseTableDataSource(this.dataService, null, null);
    this.cdr.detectChanges();
  }

  onCreate() {
    const dialogRef = this.dialog.open(AddressDialogComponent, {width: '600px'});
    dialogRef.afterClosed()
      .pipe(switchMap(item => this.dataService.add(item)))
      .subscribe(() => this.dataSource.reload())

  }

  onEdit(item: Address) {
    this.dataService.update(item)
      .subscribe(() => this.dataSource.reload())
  }

  onCopyLink(link: string): void {
    // TODO:
  }

  onDelete(id: number) {
    this.dataService.delete(id)
      .subscribe(() => this.dataSource.reload());
  }
}
