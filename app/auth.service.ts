import { Injectable,Inject } from '@angular/core';
// import * as $ from 'jquery';
import 'rxjs/add/observable/of';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';
import { HttpHeaders,HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  public AccessToken : string = '';
  public tokenKey:string = 'app_token';
  public ttl  = 12;
  constructor(private http: HttpClient) {
    
   }
  public base_url = "https://www.libanz.com/app/";
  private token_api = 'https://www.libanz.com/accounts/apis/home/dologin';

  length! : number;

  dologin(data : any)
  {
    var Headers_of_api = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    return this.http.post(this.token_api,data,{headers: Headers_of_api})
    .map(res => res)
  }
  

  private store(storage_name : string,content:Object) {
    var $content = JSON.stringify(content); 
    localStorage.setItem(storage_name, $content);
  }

private retrieve() {
    let storedToken : string = localStorage.getItem(this.tokenKey)!;
    if(!storedToken)
    {
      throw 'no token found';
    } 
    return storedToken ;
}

call_login_popup()
{
  $('.logup.modal-trigger').click();
}

get_remember()
{
  let remember_auth = localStorage.getItem('rm_');
  return remember_auth; 
}
authenticate()
{
  let token = this.retrieveToken(); 
  return token; 
}

public retrieveToken() 
{
    let currentTime:number = Math.floor(Date.now() / 1000), token = null;
    try {
        let storedToken = JSON.parse(this.retrieve());
        if(storedToken.token_key.expires_in < currentTime) throw 'invalid token found';
        token = storedToken.token_key.accessToken;
    }
    catch(err) {
        //console.error(err);
    }
    return token;
}

auth_usertype()
{
  if(this.authenticate())
  {
    let storedToken = JSON.parse(this.retrieve() || '{}');
    return storedToken.token_key.user_type;
  }
}
auth_username()
{
  if(this.authenticate())
  {
    let storedToken = JSON.parse(this.retrieve());
    return storedToken.token_key.user_name;
  }
}
auth_token()
{
  if(this.authenticate())
  {
    let storedToken = JSON.parse(this.retrieve());
    return storedToken.token_key.accessToken;
  }
}

public storage(data : any, me : any)
{
  if(!me)
    me = this;
  data.token_key.expires_in =  Math.floor(Date.now() / 1000) + ( this.ttl * 60 * 60);
  this.store(this.tokenKey,data);
  if(typeof data.rm_ != 'undefined')
    this.store('rm_',data.rm_);
}

public clear_session()
{
  localStorage.removeItem('app_token');
}

public clear_remember()
{
  localStorage.removeItem('rm_');
}
}
