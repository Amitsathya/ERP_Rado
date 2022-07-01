import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryModalComponent } from './inventory-modal/inventory-modal.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<any> | undefined;
  constructor(private matDialog: MatDialog, private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>('inventory');
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
    const dialogRef = this.matDialog.open(InventoryModalComponent, dialogConfig);
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
    const dialogRef = this.matDialog.open(InventoryModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.getData();
      }
    });
  }

  displayedColumns: string[] = ['sno', 'name', 'quantity', 'actions'];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }
}

// data = [
//   {
//     sno: 1,
//     name: 'Grinding Stone',
//     quantity: '33',
//   },
//   {
//     sno: 2,
//     name: 'Red Stone',
//     quantity: '22',
//   },
//   {
//     sno: 3,
//     name: 'Big Stone',
//     quantity: '363',
//   },
//   {
//     sno: 4,
//     name: 'Gloves',
//     quantity: 'L4 R6 ',
//   },
//   {
//     sno: 5,
//     name: 'Gloves Rub',
//     quantity: '27',
//   },
//   {
//     sno: 6,
//     name: 'Alenky nut 100',
//     quantity: '30',
//   },
//   {
//     sno: 7,
//     name: '6mm nut',
//     quantity: '7',
//   },
//   {
//     sno: 8,
//     name: 'Cutting stone',
//     quantity: '70',
//   },
//   {
//     sno: 9,
//     name: 'Machinery',
//     quantity: '7',
//   },
//   {
//     sno: 10,
//     name: 'Copper rod 3mm/3.5mm',
//     quantity: '4',
//   },
//   {
//     sno: 11,
//     name: '6660 Revit nut',
//     quantity: '2 packet',
//   },
//   {
//     sno: 12,
//     name: '8x4 sheet 0.1mm',
//     quantity: '30',
//   },
//   {
//     sno: 13,
//     name: '8x4 sheet 0.8mm',
//     quantity: '4',
//   },
//   {
//     sno: 14,
//     name: '8x4 sheet 0.13mm',
//     quantity: '20',
//   },
//   {
//     sno: 15,
//     name: '8x4 sheet 2mm',
//     quantity: '30',
//   },
// ];
