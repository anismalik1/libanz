import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule} from '@angular/material';
import { SharedCommonModule } from '../shared/common.module';
import { DashboardComponent } from './dashboard.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ExcelService } from '../export.service';
import { ValueTransferComponent } from './value-transfer.component';
import { ComplaintBoxComponent } from './complaint-box.component';
import { AddMoneyComponent } from './add-money.component';
import { TopupRequestComponent } from './topup-request.component';
import { CommissionStructureComponent } from './commission-structure.component';
import { TransactionHistoryComponent } from './transaction-history.component';
import { EditAccountComponent } from './edit-account.component';
import { BookDthOrderComponent } from './book-dth-order.component';
import { BookedOrderListComponent } from './booked-order-list.component';
import { FooterMinComponent } from '../shared/footer/footer-min.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { BookDthOrdersComponent } from './book-dth-orders.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'complaints', component: ComplaintBoxComponent },
  { path: 'value-transfer', component: ValueTransferComponent },
  { path: 'add-money', component: AddMoneyComponent },
  { path: 'topup-request', component: TopupRequestComponent },
  { path: 'commission-structure', component: CommissionStructureComponent },
  { path: 'transactions', component: TransactionHistoryComponent },
  { path: 'edit-profile', component: EditAccountComponent },
  { path: 'book-dth-orders', component: BookDthOrdersComponent },
  { path: 'book-dth-order', component: BookDthOrderComponent },
  { path: 'booked-order-list', component: BookedOrderListComponent },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedCommonModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  declarations: [DashboardComponent, ValueTransferComponent, ComplaintBoxComponent, AddMoneyComponent, TopupRequestComponent, CommissionStructureComponent, TransactionHistoryComponent, EditAccountComponent, BookDthOrderComponent, BookedOrderListComponent,FooterMinComponent, BookDthOrdersComponent],
  providers : [ExcelService]
})
export class DashboardModule { }
