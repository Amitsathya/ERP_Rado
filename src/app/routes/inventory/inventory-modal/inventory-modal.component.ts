import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Component({
  selector: 'app-inventory-modal',
  templateUrl: './inventory-modal.component.html',
  styleUrls: ['./inventory-modal.component.scss'],
})
export class InventoryModalComponent implements OnInit {
  invForm: FormGroup;
  displayedColumns: string[] = ['1', '2'];
  dataSource = new MatTableDataSource();
  LoggedUserDetails: any;
  divisionData: any;
  private itemsCollection: AngularFirestoreCollection<any> | undefined;
  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private toastr: ToastrService,
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<InventoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.invForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
    });
    this.itemsCollection = afs.collection<any>('inventory');
  }

  ngOnInit(): void {
    if (this.data.type != 'Create') {
      this.viewDivision();
    }
  }

  viewDivision() {
    const y = this.itemsCollection?.doc(this.data.data.id).ref;
    y?.get().then(res => {
      this.invForm.get('name')?.setValue(res.data().Name);
      this.invForm.get('quantity')?.setValue(res.data().Quantity);
    });
  }

  updateInv() {
    const data = {
      Name: this.invForm.get('name')?.value,
      Quantity: this.invForm.get('quantity')?.value,
    };
    const y = this.itemsCollection?.doc(this.data.data.id).ref;
    y?.update(data);
    this.dialogRef.close({ event: 'close', data: true });
    this.toastr.success('Item updated successfully!');
  }

  createInv() {
    const data = {
      Name: this.invForm.get('name')?.value,
      Quantity: this.invForm.get('quantity')?.value,
    };
    this.itemsCollection?.add(data);
    this.dialogRef.close({ event: 'close', data: true });
    this.toastr.success('Item added successfully!');
  }
}
