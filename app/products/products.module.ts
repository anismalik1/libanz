import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './cart.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedCommonModule } from '../shared/common.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductService } from '../product.service';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { MatSelectModule,MatAutocompleteModule,MatInputModule } from '@angular/material';
import { ProductDetailsComponent } from './product-details.component';
import { ProductsComponent } from './products.component';
import { CheckoutComponent } from './checkout.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { OrderReceiptComponent } from './order-receipt.component';
import { ChannelPackComponent } from './channel-pack.component';
import { CompareDthComponent } from './compare-dth.component';
import { NgxImageZoomModule } from 'ngx-image-zoom'; 
import { User } from '../user';
import { FavoritesComponent } from './favorites.component'; 
const routes: Routes = [
  { path: 'compare-box', component: CompareDthComponent },
  { path: 'listing', component: ProductsComponent },
  { path: 'channel-pack/:id', component: ChannelPackComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'order-receipt/:name', component: OrderReceiptComponent },
  { path: ':name', component: ProductDetailsComponent },
  
 // { path: ':name/multi/:name', component: ProductDetailsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    SharedCommonModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    NgxImageZoomModule.forRoot(),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  declarations: [ProductsComponent, CartComponent, ProductDetailsComponent,CheckoutComponent, OrderReceiptComponent, ChannelPackComponent, CompareDthComponent, FavoritesComponent],
  providers : [ProductService,TodoService,User,AuthService]
})

export class ProductsModule { }
