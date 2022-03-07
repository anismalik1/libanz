export class User {
    public storage: any;
}


// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { Headers,Http } from '@angular/http';
// import { AuthService } from './auth.service';

// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

// @Injectable()
// export class User {
//     public server_url : string = "https://mydthshop.com/";
//     public base_url : string = 'https://mydthshop.com/web-app/';
//     public service_url : string = 'https://mydthshop.com/index.php?/app_services/';
//     public storage: any;
//     public request_action;
//     public constructor( private http : Http , private authservice : AuthService) {
    
//         // if(this.get_token())
//         // {
//         //     this.fetch_user_info({token: this.get_token()})
//         //     .subscribe(
//         //         data => 
//         //         {
//         //         if(data.status == 'Invalid Token')
//         //         {                                                     
//         //             this.authservice.clear_session();
//         //             //this.router.navigate(['/login']);
//         //         }
//         //         this.set_user_data(data.USER);
//         //         }
//         //     )  
//         // }
//     }

//     set_user_data(data)
//     {
//       let b = JSON.stringify(data);
//       this.storage =  JSON.parse(b.replace(/\\/g, ''));
//     }

//     get_token()
//     {
//         return this.authservice.auth_token();
//     }

//     fetch_user_info(data)
//     {
//         this.request_action = 'fetch_user_info';
//         return this.send_post_request(data) ; 
//     }

//     send_post_request(data) : Observable<any>
//     {
//         var Headers_of_api = new Headers({
//         'Content-Type' : 'application/x-www-form-urlencoded'
//         });
//         return this.http.post(this.service_url+this.request_action,data,{headers: Headers_of_api})
//         .map(res => res.json());
//     }
// }