import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule,MatAutocompleteModule,MatInputModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { SharedCommonModule } from '../shared/common.module';
import { HttpModule } from '@angular/http';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Params } from '../shared/config/params.service';
import { HomeComponent } from './home.component';
import { RechargeStatusComponent } from './recharge-status.component';
import { RechargeComponent } from './recharge.component';
import { RechargeType } from '../recharge.type';
import { Nl2pbrPipe } from './nl2pbr.pipe';
import { BlogComponent } from './blog.component';
import { BlogDetailComponent } from './blog-detail.component';
const routes: Routes = [
  { path: 'recharge/:name', component: RechargeComponent },
  { path: 'recharge/:name/proceed', component: RechargeComponent },
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog-detail/:name', component: BlogDetailComponent },
  { path: 'orders/recharge-receipt/:name', component: RechargeStatusComponent }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedCommonModule
  ],
  declarations: [HomeComponent, RechargeStatusComponent, RechargeComponent,Nl2pbrPipe, BlogComponent, BlogDetailComponent],
  providers : [TodoService,AuthService,User,Params,RechargeType]

})
export class HomeModule { }
