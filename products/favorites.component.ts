import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styles: [],
  providers : [ProductService]
})
export class FavoritesComponent implements OnInit {
  public favourites : any = [];
  public favourite_count : number;
  
  constructor(
    public todoservice : TodoService,
    private authservice : AuthService,
    public productservice : ProductService,
    public router : Router,
    private spinner: NgxSpinnerService
  ) { 
    this.spinner.show();
      this.user_favourites();
  }
  ngOnInit() {
    $('.copy-click').on('click',function(){			
			$('.copy-click').attr('disabled');
    });
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/login/ref/'+full_url[1]+full_url[2]]);
    }  
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
  convert_to_object(string)
  {
    //console.log(JSON.parse(string))
    return JSON.parse(string);
  }
  user_favourites()
  {
    this.spinner.show();
    this.todoservice.user_favourites({token: this.get_token()})
        .subscribe(
          data => 
          {
            if(!jQuery.isEmptyObject(data))
            {
              this.spinner.hide();
              if(data.status && data.status == 'Invalid Token')
              {
                return false;
              }
              localStorage.setItem('favourite', JSON.stringify(data.favourites));
              this.favourites = data.favourites.items;
              this.favourite_count =  data.count;
              $('#favourite-count').text(this.favourite_count);
            }
          }
        )  
  }
  removeItem(id)
  {
    this.spinner.show();
    this.todoservice.remove_favourites({product_id : id,token: this.get_token()})
    .subscribe(
      data => 
      {
        if(!jQuery.isEmptyObject(data))
        {
          this.spinner.hide();
          if(data.status && data.status == 'Invalid Token')
          {
            return false;
          }
          localStorage.setItem('favourite', JSON.stringify(data.favourites));
          this.favourites = data.favourites.items;
          this.favourite_count =  data.count;
          $('#favourite-count').text(this.favourite_count);
        }
      }
    )
  }
}
