import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { EmployeeRoutingModule } from './employee-routing.module';
import { PayrollDialogComponent } from './payroll/payroll-dialog/payroll-dialog.component';

import { PayrollComponent } from './payroll/payroll.component';
import { AttendanceComponent } from './attendance/attendance.component';

const COMPONENTS: any[] = [PayrollComponent,PayrollDialogComponent, AttendanceComponent];
const COMPONENTS_DYNAMIC: any[] = [];

@NgModule({
  imports: [SharedModule, EmployeeRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
})
export class EmployeeModule {}
