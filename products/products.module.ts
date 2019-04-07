import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedCommonModule } from '../shared/common.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductService } from '../product.service';
import { MatSelectModule } from '@angular/material';
import { ProductDetailsComponent } from './product-details.component';
import { Params } from '../shared/config/params.service';
import { ProductsComponent } from './products.component';
import { CheckoutComponent } from './checkout.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { OrderReceiptComponent } from './order-receipt.component';
import { OffersComponent } from './offers.component';
import { ChannelPackComponent } from './channel-pack.component';
import { CompareDthComponent } from './compare-dth.component';
import { MultiComponent } from './multi.component';
const routes: Routes = [
  { path: 'compare-box', component: CompareDthComponent },
  { path: 'listing', component: ProductsComponent },
  { path: 'channel-pack/:id', component: ChannelPackComponent },
  { path: 'offers/:name', component: OffersComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-receipt/:name', component: OrderReceiptComponent },
  { path: ':name', component: ProductDetailsComponent },
  { path: 'multi/:name', component: MultiComponent },
 // { path: ':name/multi/:name', component: ProductDetailsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    SharedCommonModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  declarations: [ProductsComponent, CartComponent, ProductDetailsComponent,CheckoutComponent, OrderReceiptComponent, OffersComponent, ChannelPackComponent, CompareDthComponent, MultiComponent],
  providers : [ProductService]
})

export class ProductsModule { }
