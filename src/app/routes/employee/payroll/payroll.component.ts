import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { PayrollDialogComponent } from './payroll-dialog/payroll-dialog.component';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
})
export class PayrollComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<any> | undefined;
  constructor(private matDialog: MatDialog, private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>('payroll');
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    const x: any[] = [];
    const snapshot = await this.itemsCollection?.ref.get();
    snapshot?.docs.map(doc => {
      const data = doc.data();
      const id = doc.id;
      x.push({ data, id });
    });
    this.dataSource = new MatTableDataSource(x);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onView() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '40%';
    dialogConfig.maxWidth = '70%';
    dialogConfig.data = {
      type: 'Create',
    };
    const dialogRef = this.matDialog.open(PayrollDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.getData();
      }
    });
  }

  onUpdate(x: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '40%';
    dialogConfig.maxWidth = '70%';
    dialogConfig.data = {
      type: 'Update',
      data: x,
    };
    const dialogRef = this.matDialog.open(PayrollDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.getData();
      }
    });
  }

  displayedColumns: string[] = [
    'sno',
    'name',
    'present',
    'perday',
    'total',
    'tea',
    'overtime',
    'amount',
    'ftotal',
    'advance',
    'payable',
    'actions',
  ];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }
}
