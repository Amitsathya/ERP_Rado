import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  NgZone,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SettingsService } from '@core';
import { Subscription } from 'rxjs';

import { DashboardService } from './dashboard.srevice';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .mat-raised-button {
        margin-right: 8px;
        margin-top: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol', 'amount'];
  dataSource = this.dashboardSrv.getData();
  charts = this.dashboardSrv.getCharts();
  chart1: any;
  chart2: any;

  stats = this.dashboardSrv.getStats();

  notifySubscription!: Subscription;

  constructor(
    private ngZone: NgZone,
    private dashboardSrv: DashboardService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    this.dataSource1 = new MatTableDataSource(this.data);
    this.dataSource1.paginator = this.paginator;
    this.notifySubscription = this.settings.notify.subscribe(res => {
      console.log(res);
    });
  }

  dataSource1 = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initChart());
  }

  ngOnDestroy() {
    if (this.chart1) {
      this.chart1?.destroy();
    }
    if (this.chart2) {
      this.chart2?.destroy();
    }

    this.notifySubscription.unsubscribe();
  }

  initChart() {
    this.chart1 = new ApexCharts(document.querySelector('#chart1'), this.charts[0]);
    this.chart1?.render();
    this.chart2 = new ApexCharts(document.querySelector('#chart2'), this.charts[1]);
    this.chart2?.render();
  }
  data: any[] = [
    {
      Item: 'Disel',
      Amount: '1300',
    },
    {
      Item: 'VST',
      Amount: '200',
    },
    {
      Item: 'VST',
      Amount: '100',
    },
    {
      Item: 'Disel',
      Amount: '100',
    },
    {
      Item: 'VST',
      Amount: '1200',
    },
    {
      Item: 'Boy',
      Amount: '200',
    },
    {
      Item: 'Toll',
      Amount: '100',
    },
    {
      Item: 'Varu',
      Amount: '5000',
    },
    {
      Item: 'Envipaper, switch, Top 6mm',
      Amount: '1600',
    },
    {
      Item: 'Bike',
      Amount: '100',
    },
    {
      Item: 'Disel',
      Amount: '200',
    },
    {
      Item: 'Salary',
      Amount: '47260',
    },
    {
      Item: 'Naden',
      Amount: '1300',
    },
    {
      Item: 'Abunch',
      Amount: '500',
    },
    {
      Item: 'Disel',
      Amount: '100',
    },
    {
      Item: 'Denum',
      Amount: '100',
    },
    {
      Item: 'Disel',
      Amount: '100',
    },
    {
      Item: 'BESCOM Bill pad. 9.MTR.',
      Amount: '28800',
    },
    {
      Item: 'of UST DISH',
      Amount: '1500',
    },
    {
      Item: 'Walleb Boy',
      Amount: '200',
    },
    {
      Item: 'Toll',
      Amount: '100',
    },
    {
      Item: 'Salary',
      Amount: '',
    },
    {
      Item: 'Water',
      Amount: '50',
    },
    {
      Item: 'COVER Naden',
      Amount: '6000',
    },
    {
      Item: '',
      Amount: '45861',
    },
    {
      Item: 'Airel Bill paid',
      Amount: '2828.92',
    },
    {
      Item: 'W. F Disel L.H Supply',
      Amount: '500',
    },
    {
      Item: 'Boy',
      Amount: '150',
    },
    {
      Item: 'Disel W.F',
      Amount: '400',
    },
    {
      Item: 'Boy',
      Amount: '150',
    },
    {
      Item: 'W.F Naden',
      Amount: '200',
    },
    {
      Item: 'W.F',
      Amount: '200',
    },
    {
      Item: 'W.F Disel',
      Amount: '200',
    },
    {
      Item: 'KEB',
      Amount: '100',
    },
    {
      Item: 'KEB',
      Amount: '1000',
    },
  ];
}
