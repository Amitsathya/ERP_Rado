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
  selector: 'app-payroll-dialog',
  templateUrl: './payroll-dialog.component.html',
  styleUrls: ['./payroll-dialog.component.scss'],
})
export class PayrollDialogComponent implements OnInit {
  payrollForm: FormGroup;
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
    public dialogRef: MatDialogRef<PayrollDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.payrollForm = this.fb.group({
      name: ['', Validators.required],
      present: { value: 0, disabled: true },
      perDay: [0, Validators.required],
      total: { value: 0, disabled: true },
      tea: 0,
      overTime: 0,
      amount: 0,
      ftotal: { value: 0, disabled: true },
      payable: { value: 0, disabled: true },
      active: true,
      advance: [0, Validators.required],
    });
    this.itemsCollection = afs.collection<any>('payroll');
  }

  ngOnInit(): void {
    if (this.data.type != 'Create') {
      this.viewDivision();
    }
  }

  viewDivision() {
    const y = this.itemsCollection?.doc(this.data.data.id).ref;
    y?.get().then(res => {
      this.payrollForm.get('name')?.setValue(res.data().Name);
      this.payrollForm.get('present')?.setValue(res.data().Present);
      this.payrollForm.get('perDay')?.setValue(res.data().PerDay);
      this.payrollForm.get('tea')?.setValue(res.data().Tea);
      this.payrollForm.get('total')?.setValue(res.data().Total);
      this.payrollForm.get('overTime')?.setValue(res.data().OverTime);
      this.payrollForm.get('amount')?.setValue(res.data().Amount);
      this.payrollForm.get('ftotal')?.setValue(res.data().FTotal);
      this.payrollForm.get('payable')?.setValue(res.data().Payable);
      this.payrollForm.get('active')?.setValue(res.data().Active);
      this.payrollForm.get('advance')?.setValue(res.data().Advance);
    });
  }

  updateInv() {
    const data = {
      Name: this.payrollForm.get('name')?.value,
      Present: this.payrollForm.get('present')?.value,
      PerDay: this.payrollForm.get('perDay')?.value,
      Tea: this.payrollForm.get('tea')?.value,
      Total: this.payrollForm.get('total')?.value,
      OverTime: this.payrollForm.get('overTime')?.value,
      Amount: this.payrollForm.get('amount')?.value,
      FTotal: this.payrollForm.get('ftotal')?.value,
      Payable: this.payrollForm.get('payable')?.value,
      Active: this.payrollForm.get('active')?.value,
      Advance: this.payrollForm.get('advance')?.value,
    };
    const y = this.itemsCollection?.doc(this.data.data.id).ref;
    y?.update(data);
    this.dialogRef.close({ event: 'close', data: true });
    this.toastr.success('Employee updated successfully!');
  }

  createInv() {
    const data = {
      Name: this.payrollForm.get('name')?.value,
      Present: 1,
      PerDay: this.payrollForm.get('perDay')?.value,
      Tea: 0,
      Total: this.payrollForm.get('perDay')?.value,
      OverTime: 0,
      Amount: 0,
      FTotal: this.payrollForm.get('perDay')?.value,
      Payable: this.payrollForm.get('perDay')?.value - this.payrollForm.get('advance')?.value,
      Active: this.payrollForm.get('active')?.value,
      Advance: this.payrollForm.get('advance')?.value,
    };
    this.itemsCollection?.add(data);
    this.dialogRef.close({ event: 'close', data: true });
    this.toastr.success('Employee added successfully!');
  }

  calculate(x: any) {
    switch (x) {
      case 0:
        this.payrollForm
          .get('total')
          ?.setValue(
            Number(this.payrollForm.get('perDay')?.value) *
              Number(this.payrollForm.get('present')?.value)
          );
        this.payrollForm
          .get('ftotal')
          ?.setValue(
            Number(this.payrollForm.get('total')?.value) +
              Number(this.payrollForm.get('amount')?.value)
          );
        this.payrollForm
          .get('payable')
          ?.setValue(
            Number(this.payrollForm.get('ftotal')?.value) -
              Number(this.payrollForm.get('advance')?.value)
          );
        break;
      case 1:
        this.payrollForm
          .get('ftotal')
          ?.setValue(
            Number(this.payrollForm.get('total')?.value) +
              Number(this.payrollForm.get('amount')?.value)
          );
        this.payrollForm
          .get('payable')
          ?.setValue(
            Number(this.payrollForm.get('ftotal')?.value) -
              Number(this.payrollForm.get('advance')?.value)
          );
        break;
        break;
      case 2:
        this.payrollForm
          .get('payable')
          ?.setValue(
            Number(this.payrollForm.get('ftotal')?.value) -
              Number(this.payrollForm.get('advance')?.value)
          );
        break;
      default:
        console.log('No actions');
        break;
    }
  }
}
