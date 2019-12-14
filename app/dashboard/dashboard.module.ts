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

import { BookDthOrdersComponent } from './book-dth-orders.component';
import { AuthService } from '../auth.service';
import { TodoService } from '../todo.service';
import { ProductService } from '../product.service';
import { User } from '../user';
import { RechargeOrdersComponent } from './recharge-orders.component';
import { DthOrdersComponent } from './dth-orders.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule} from 'ngx-pagination';
const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'recharge', component: RechargeOrdersComponent },
  { path: 'complaints', component: ComplaintBoxComponent },
  { path: 'value-transfer', component: ValueTransferComponent },
  { path: 'add-money', component: AddMoneyComponent },
  { path: 'topup-request', component: TopupRequestComponent },
  { path: 'commission-structure', component: CommissionStructureComponent },
  { path: 'transactions', component: TransactionHistoryComponent },
  { path: 'edit-profile', component: EditAccountComponent },
  { path: 'dth-orders', component: DthOrdersComponent },
  { path: 'book-dth-order', component: BookDthOrderComponent },
  { path: 'booked-order-list', component: BookedOrderListComponent }, 
  {path: '**', redirectTo: '/error/404'},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    SharedCommonModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    NgxDaterangepickerMd.forRoot(),
    ImageCropperModule
  ],
  declarations: [DashboardComponent, ValueTransferComponent, ComplaintBoxComponent, AddMoneyComponent, TopupRequestComponent, CommissionStructureComponent, TransactionHistoryComponent, EditAccountComponent, BookDthOrderComponent, BookedOrderListComponent,FooterMinComponent, BookDthOrdersComponent, RechargeOrdersComponent, DthOrdersComponent],
  providers : [ExcelService,AuthService,TodoService,User,ProductService]
})
export class DashboardModule { }
