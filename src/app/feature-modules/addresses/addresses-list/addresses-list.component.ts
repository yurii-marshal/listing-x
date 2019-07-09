import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseTableDataSource } from '../../../core-modules/datasources/base-table-data-source';
import { AddressesService } from '../addresses.service';
import { Address } from '../../model';

@Component({
  selector: 'app-addresses-list',
  templateUrl: './addresses-list.component.html',
  styleUrls: ['./addresses-list.component.scss']
})
export class AddressesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'name', 'address', 'offersCreated', 'offersSigned', 'actions'];

  dataSource: BaseTableDataSource<Address>;

  constructor(private cdr: ChangeDetectorRef,
              private dataService: AddressesService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.dataSource = new BaseTableDataSource(this.dataService, null, null);
    this.cdr.detectChanges();
  }

  onAdd(): void {

  }
}
