import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { SharedCommonModule } from '../shared/common.module';
import { HttpClientModule } from '@angular/common/http';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Params } from '../shared/config/params.service';
import { RechargeStatusComponent } from './recharge-status.component';
import { RechargeComponent } from './recharge.component';
import { RechargeType } from '../recharge.type';
import { Nl2pbrPipe } from './nl2pbr.pipe';
import { TruncatePipe } from './truncatePipe';
import { BlogComponent } from './blog.component';
import { BlogDetailComponent } from './blog-detail.component';
import { HomeComponent } from './home.component';
import { ImageCropperModule } from 'ngx-image-cropper';
const routes: Routes = [
  
  //{ path: 'recharge/:name/proceed', component: RechargeComponent },
  { path: '', component: HomeComponent },
  { path: 'mhome', redirectTo: '/' },
  { path: 'home', redirectTo: '/' },
  { path: 'blog/:name', component: BlogComponent },
  { path: 'blog-detail/:name', component: BlogDetailComponent },
  { path: 'for/:name', component: RechargeComponent },
  { path: 'orders/recharge-receipt/:name', component: RechargeStatusComponent },
  { path: ':name/proceed', component: RechargeComponent },
  {path: '**', redirectTo: '/error/404'},
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SharedCommonModule,
    ImageCropperModule
  ],
  exports: [ MatFormFieldModule, MatInputModule ],
  declarations: [HomeComponent, RechargeStatusComponent, RechargeComponent,Nl2pbrPipe,TruncatePipe, BlogComponent, BlogDetailComponent],
  providers : [TodoService,AuthService,User,Params,RechargeType]

})
export class HomeModule { }
