import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  attForm: FormGroup;
  empList: Array<any> = [];
  chart1: any;
  date = '';
  absent: Array<any> = [];
  present: Array<any> = [];
  recorded = false;
  // recorded: string
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  private payrollCollection: AngularFirestoreCollection<any> | undefined;
  private attCollection: AngularFirestoreCollection<any> | undefined;
  constructor(
    private ngZone: NgZone,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.payrollCollection = afs.collection<any>('payroll');
    this.attCollection = afs.collection<any>('attendance');
    this.attForm = this.fb.group({
      employee: ['', Validators.required],
      absent: true,
    });
  }

  ngOnInit() {
    this.getEmployee();
    const d = new Date();
    this.date = d.getDate().toString() + ' ' + this.monthNames[d.getMonth()];
    // if (d.getHours() > 9 && d.getHours() < 11) {
    const y = this.attCollection?.doc(this.date);
    const doc = y?.ref.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        this.recorded = true;
      } else {
        const data: any = {};
        const empData: Array<any> = [];
        this.payrollCollection?.get().subscribe(snapshot => {
          snapshot.forEach(res => {
            empData.push(res.data().Name);
          });
          for (let i = 0; i <= empData.length; i++) {
            data[empData[i]] = true;
          }
          this.attCollection?.doc(this.date).set(data);
          this.toastr.success('Attendance recorded for ' + this.date);
          this.updatePayroll();
        });
      }
    });
    // }
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initChart());
  }

  ngOnDestroy() {
    if (this.chart1) {
      this.chart1?.destroy();
    }
  }

  convertData(res: any) {
    const name = Object.keys(res.data());
    const day = Object.values(res.data());
    for (let i = 0; i < day.length; i++) {
      const a = new Date(res.id);
      a.setFullYear(2022);
      const b = new Date(a.valueOf() + 1000 * 60 * 60 * 24);
      if (day[i] == false) {
        this.absent.push({
          x: `${name[i]}`,
          y: [a.getTime(), b.getTime()],
        });
      } else {
        this.present.push({
          x: `${name[i]}`,
          y: [a.getTime(), b.getTime()],
        });
      }
    }
  }

  initChart() {
    this.attCollection?.get().subscribe(snapshot => {
      snapshot.forEach(res => {
        this.convertData(res);
      });
      const charts = {
        series: [
          {
            name: 'Present',
            data: this.present,
            color: '#00E396',
          },
          {
            name: 'Absent',
            data: this.absent,
            color: '#CD2F2A',
          },
        ],
        chart: {
          animations: {
            enabled: false,
          },
          foreColor: '#cc6e16',
          height: 450,
          type: 'rangeBar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '80%',
          },
        },
        xaxis: {
          type: 'datetime',
        },
        stroke: {
          width: 1,
        },
        fill: {
          type: 'solid',
          opacity: 0.6,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
        },
      };
      this.chart1 = new ApexCharts(document.querySelector('#chart1'), charts);
      this.chart1?.render();
    });
  }

  getEmployee() {
    this.payrollCollection?.get().subscribe(snapshot => {
      snapshot.forEach(res => {
        this.empList.push(res.data().Name);
      });
    });
  }

  save() {
    const name = this.attForm.get('employee')?.value;
    const add = this.attForm.get('absent')?.value ? 1 : -1;
    this.updatePayrollbyID(name, add);
    const data: any = {};
    data[name] = !this.attForm.get('absent')?.value;
    console.log(data);
    const y = this.attCollection?.doc(this.date).ref;
    y?.update(data);
    this.attForm.get('employee')?.setValue(null);
    this.attForm.get('employee')?.clearAsyncValidators();
    this.attForm.get('employee')?.reset();
    this.attForm.get('employee')?.updateValueAndValidity();
    this.toastr.success(`Attendance updated for ${name} successfully!`);
    this.attCollection?.get().subscribe(snapshot => {
      snapshot.forEach(res => {
        this.convertData(res);
      });
      this.chart1.updateSeries([
        {
          name: 'Present',
          data: this.present,
          color: '#00E396',
        },
        {
          name: 'Absent',
          data: this.absent,
          color: '#CD2F2A',
        },
      ]);
      this.chart1.render();
    });
  }

  updatePayroll() {
    this.payrollCollection?.get().subscribe(snapshot => {
      snapshot.forEach(res => {
        const present = Number(res.data().Present) + 1;
        const total = Number(res.data().PerDay) * present;
        const ftotal = Number(total) + Number(res.data().Amount);
        const Payable = ftotal - Number(res.data().Advance);
        const y = this.payrollCollection?.doc(res.id).ref;
        const data = {
          Present: present,
          Total: total,
          FTotal: ftotal,
          Payable,
        };
        y?.update(data);
      });
    });
  }

  updatePayrollbyID(x: any, add: any) {
    this.payrollCollection?.get().subscribe(snapshot => {
      snapshot.forEach(res => {
        if (res.data().Name == x) {
          const present = Number(res.data().Present) - add;
          const total = Number(res.data().PerDay) * present;
          const ftotal = Number(total) + Number(res.data().Amount);
          const Payable = ftotal - Number(res.data().Advance);
          const y = this.payrollCollection?.doc(res.id).ref;
          const data = {
            Present: present,
            Total: total,
            FTotal: ftotal,
            Payable,
          };
          y?.update(data);
        }
      });
    });
  }
}
