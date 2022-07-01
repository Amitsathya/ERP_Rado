import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PeriodicElement {
  Date: string;
  PartNumber: string;
  PartName: string;
  Quantity: string;
  Amount: string;
}

export interface PeriodicElement1 {
  Item: string;
  Amount: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    Date: '1-12-2021',
    PartNumber: '3139',
    PartName: 'COVERUBELI',
    Quantity: '180',
    Amount: '123832.8',
  },
  {
    Date: '7-12-2021',
    PartNumber: '3140',
    PartName: 'COUBICONDENS',
    Quantity: '200',
    Amount: '86856',
  },
  {
    Date: '10-12-2021',
    PartNumber: '3141',
    PartName: 'COVER VBELT',
    Quantity: '180',
    Amount: '123832.8',
  },
  {
    Date: '16-12-2021',
    PartNumber: '3142',
    PartName: '400 COVER LONDEN',
    Quantity: '200',
    Amount: '8685600',
  },
  {
    Date: '21-12-2021',
    PartNumber: '3143',
    PartName: '540 COVERUBEL',
    Quantity: '180',
    Amount: '123832.8',
  },
  {
    Date: '25-12-2021',
    PartNumber: '3144',
    PartName: 'bod COVERCOMER',
    Quantity: '202',
    Amount: '92067.36',
  },
  {
    Date: '30-12-2021',
    PartNumber: '3145',
    PartName: '720 COVERUBELS',
    Quantity: '180',
    Amount: '123832.8',
  },
];
@Injectable()
export class DashboardService {
  stats = [
    {
      title: 'Total Sales',
      amount: '1322',
      progress: {
        value: 80,
      },
      color: 'bg-indigo-500',
    },
    {
      title: 'Revenue',
      amount: '147699.92',
      progress: {
        value: 80,
      },
      color: 'bg-blue-500',
    },
    {
      title: 'Inventory',
      amount: '657',
      progress: {
        value: 80,
      },
      color: 'bg-green-500',
    },
    {
      title: 'Employees',
      amount: '17',
      progress: {
        value: 100,
      },
      color: 'bg-teal-500',
    },
  ];

  charts = [
    {
      chart: {
        foreColor: '#cc6e16',
        height: 350,
        type: 'area',
        toolbar: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'Sales',
          data: [31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: 'Expense',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      xaxis: {
        type: 'datetime',
        categories: [
          '2022-06-04T00:00:00',
          '2022-06-11T01:30:00',
          '2022-06-15T02:30:00',
          '2022-06-18T03:30:00',
          '2022-06-22T04:30:00',
          '2022-06-25T05:30:00',
          '2022-06-27T06:30:00',
        ],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
    },
    {
      chart: {
        foreColor: '#cc6e16',
        height: 350,
        type: 'radar',
      },
      series: [
        {
          name: 'Weekly Revenue',
          data: [20, 100, 40, 30, 50, 80, 33],
        },
      ],
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      plotOptions: {
        radar: {
          size: 140,
          polygons: {
            strokeColor: '#e9e9e9',
            fill: {
              colors: ['#f8f8f8', '#fff'],
            },
          },
        },
      },
      colors: ['#FF4560'],
      markers: {
        size: 4,
        colors: ['#fff'],
        strokeColor: '#FF4560',
        strokeWidth: 2,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val,
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: (val: number, i: number) => {
            if (i % 2 === 0) {
              return val;
            } else {
              return '';
            }
          },
        },
      },
    },
  ];

  constructor(private http: HttpClient) {}

  getData() {
    return ELEMENT_DATA;
  }

  getCharts() {
    return this.charts;
  }

  getStats() {
    return this.stats;
  }
}
