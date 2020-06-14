import { Component, OnInit,ViewChild ,Renderer2,Inject} from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms'; 
import { ToastrManager } from 'ng6-toastr-notifications';
import {Meta,Title } from "@angular/platform-browser";
import { DOCUMENT} from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Params } from '../shared/config/params.service';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Package } from '../packages.entities.service';
@Component({
  selector: 'app-mobile-home',
  templateUrl: './mobile-home.component.html',
  styles: []
})
export class MobileHomeComponent implements OnInit {
  public userinfo = {wallet:'',phone:'',name:''};
  public operators : any = {};
  public loop : boolean = false;
  public selectedOperator : number ;
  public rechargeAmount : number ;
  public rechargeId : number ;
  public op_list = '';
  public recharge_ini : number = 1;
  public deal_timer : number = 0;
  public mainbanners : any = [{image: "dth-recharge-banner_1.png",imageurl: "https://www.mydthshop.com/recharge/for/dth-recharge",position: "mobile-main-banner"}];
  public bottombanners : any = [{image: "rechargebill-11.jpg",imageurl: "",position: "mobile_bottom_banner"}];
  no_dues = 0;
  bill_amt : number;
  due_msg : string = 'No pending dues.';
  rechargeData : any ;
  flash_deals : any;
  all_products : any;
  product_ratings : any = [];
  tata_slides : any;
  dishtv_slides : any;
  videcone_slides : any;
  airtel_slides : any;
  instant_checked : boolean = true;
  circles : any;
  pay_step : number = 1;
  prepaid_list : number = 1;
  dthminlength : number = 0;
  dthmaxlength : number = 0;
  viewrange : number = 0;
  showstd : number = 0;
  banners : any = [];
  order : any = {};
  recommended : any;
  package_item : Package;
  packages : Package[];
  product_mpackages : Package[];
  user_cashback : any ;
  region :number = 0;
  activity : number = 0;
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: Observable<object>;
  filterdList : boolean = false;
  services_icons : any = {
    broadband : 'data:image/png;base64,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',
    dth : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOKTnS6vkVAAAEhklEQVRo3sWZa2wUVRTHfy20dClIWUFSQ0LZSiKJChKRKqRRY6RQCYaokRCJxlBDTGglvsEEot80BhWfCGoCIUbw+UHBoBi1VayQkoJQU5RnldJaAkVLaa8f9szd2dl5pTN3PfNh9zzm/P/3zNznQHwyjC30cZaT7OYt7ufKGHOHklpU1jXIbpZSnD8CsxwE0tdRllHoV7b45CSnGEEPF7mMAm0dwwJq+IEz+asEJKjmOdptdTjPknwSSEsB82i0vRFP558CFLCUbk1itWm4aTxGHXcyKctawV5N4QGT8Cn+0UB7WcUY7RnN12K/wLXmCCxydMBO6nUHHMXPYm1huCkCZfyWMwp8xmjxTqRTbA3mapBgNktYzU8Magot+lHcLZbTlJqjYMl0dmoKX+jh7iux1JsnAAWsYkAAnxFbleit+SAA8KQAnmOCWKxX0UBfmMIGjtHHMTZQqa2fCOCLojeIvjJ84iQb2cVtAVF30Wt793tZKPYUfSgUJ2R6mioRn4aFL6UJhaKPBT5R19mGIGvAuUZ8n4vlBtG7UCjawhL4UKf0o/CxbnmzrsR28dWJ/rDo6empP9xCoC6rVV4UiqT93VQCV/G31CA94lXL3WsdZMuC4a+QVEoX2J1CuaPN20UvByAl2uvi3SR6iBXjej2xXM1xHwolMu61UwIkOIJCMUAJAIX8ikJxn0QvRqE4aFszech4eZr9zAAqfSl8J779vMR++f+9rZIrmGuLrmEF44Pb/6gkel90bwoZj/2qDYbwlz2S6GYXIDsFd/jno8KPlXH8gEdbLQp2y2H5d5h7o8JDjePddafgJJSiisnRwQHqJfGDOR47aEeIQWqI8oKkvsnF53zqBuDhTUl+vavXTiEivNeuTcnvRVdvO7dwIp6WehHold9xHv4MhWK2RamBF4Hj8jvF88525vCHprCQmMXqhut8o/wH6EhSJgPR0YBJYxK/awoxV+FHSXxjQJyxKliT0ZbASEMUkpwnva+fGRhr6EG8KkkbKfp/qpCUFaxiU4hoI1V4SA+4T4SItldhboj4UPKBprA+xL6+ktMSfSBE7lCSkI2JQvENU31jL+ddvS3fExeBTHdML1DfIOUaNYGn+EvHdTAtbPrAxTE7uMNhaeYjWmijCyglxUzmMN92JHuQWpklYpCRsinp4ZzL0jP3GuRlRsZXfpgvid+mnI22gxf3ayez4gQHeEVSLwJgnyd0F68FzhquEtS1agDoZxcAO5gOwFaOUEExYznDn7TRSCsDcbcdYLK071vRbxV9swkwN3lEAK1j5iLOolB0+n0BiFOs043M2tg68wmeIWOQYul6HbbRYrkQeDYfBG4XsPdstoqczbdBsXZHi7Osh1AoLpE0T6BVTjqyDxPWCa17TMNPFKAmh32e2N8xTWCZAK1x2BNcQKE4FWIiiyTbhEBVjudL8Rj89gHD5Yiu2+VA0VohPB4HUKaM1ay0fUhIMBuAHppz7kkyA4COrIXXL6zh36ETGUFPqPne7xpSRQo1gVGRqzku2u0NkWowQNPQPtf/B26nB+ucfYIjAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjQxOjU3KzAwOjAwvfqm3gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDo0MTo1NyswMDowMMynHmIAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    mobile : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOJwOKZQ0pAAABeklEQVRo3u2Zv0oDQRCHv8QkoCC2YqIIigQxZV5A9A18gIgIooitryAIdoKdjaClCFYRsfABFMEqjQkE/IMWRjFK1i5c5DLZ20UOcWabu90f8/tu9uaKW+gdaZY55xETYbxwyQb9Ftl7xiQ3kayDo0LB1z5LzdneYLhn3A/g2MveYDj1sZ8KSfhGgUW+mOlQjvDQFSEvWSRFgPmQuT4aNIBEx2zix30w5iSLlAiQC5nLUAHg2rqOWfcKpK1NnB8yaZvltyJloWmy45h9liIIb4clwAebjgDbFAEjSWLfgn8BoFugAAoQO4C2oQIogHaBAiiAdoECKEDsANqGCqAA2gUKoADaBWLY/CselIv4xyvgA/DKOmNMs+sDIG/Bp7i6wgEAawxQEnRN9wrUhLV3jtrX+2KWqjtAWVgzgVezJerO8IgT4Uhyoa3aE1SHPvYwSr1r6mdKDJFji1ZXzR3DfgCQ59b52PaKCV97gAyrXPAUwbhFnTJLNp+5b3gBJOk+a18zAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjM5OjAzKzAwOjAwO7nZ3gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDozOTowMyswMDowMErkYWIAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    electricity : 'data:image/png;base64,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',
    water : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOLDY/IhDBAAAEVklEQVRo3sWYW2xUVRSGvzJTpq0FkYJoqYim4C2IaKIlEQlIDC8+GEMsNkF9wGCiIcqT1iuNiQFaIqY2JEZ9MsYrkWDUxJeWqA8goVpLRU2xaAJpLKa12Hamxwf2+edM50xnn8uM6zzMmX32//9rr31be0MUa+EMZ3k4EkcEayKNg0Oapv9DPkUfjnlOUV1+B/ZK3sFhT7nl7zLhd58Md5dTPsWPOfJl74Y9ku2lt/zd0KTwT7KGNUyaf2WaDd7R/yIAL5W3G7Kj/ziVAFRyXGV7Sy2/VuGfYJVKb2VCs2FdKeWrPOFvzfmS7YaBUnZDh2S+N+F3LckxfWsvlbx/+F1brdmQ4Z5SyNcwUCD8rr2i779SG78D7aI/RtK3xlxOlq4bVjM1S/hdu82zKN0Rp3zCM9Ofn7Xmq55VImnJbmG7RPsDc2etmaJfdXfFJX8tYxrfa4vW3sC0qT3G8ngc+FRtesOq/tuq/0kc8ptEN8R8K8RCzglzX1T5pGe/f8ga9ZgwP81YMQPbTlF1U2GNquAb4Z6OIl/HX4ZmilsCIW/Xsn2BxeEdyKZeHYGxXdFXxXrGDcUwC0JE74JBX6QhnANvqg3PhMI/J/zBMPDlynIGSYVyoJoh7Qw3BIcflP+PhAsg8Lg43goKreMfA+0nEdqBJL9oHBSYC3MK+l5j3trJhHYgzX7zVsWOYJ7/bjw/R1VoeYAazospwEh60HL3t7GXxdVsD3pPR69FkR1YolzqA1tIJSMGciSyPMBXhm3Urzv9BuFGrXsfxuKAy1LLvXaAA0o/r4jFgTp1QqcdwN1Kv4tFHtCp6dv8T35d4C6bvREkE2xnnzLIkzOYi0Azxt+2CA7szrmycJP1TP6qmh+BCpVNR3Cg2TTm/hwmn5wq34E0F81b+PNdQgn5JS43mR3PX9b9xsCI+b0mtAOrlIr+AcAy82/YJgLws/kNsYcb26y3EwDcOIO5iHUpjbg8lHyC04ZhhASwSGel1+0i0COiDaEc2EajefuIDLBJg6/bjuAqefx+CPl6hrX/3QnAZ4roQluSHuUxSwLKz/PcFR0CYJnuDL60p9kuktcCyTd47hHGWAFAp0pa7IkuUx4zzvXWqEe1jTs4JgW7We3/M1hu1SqiLwrmjbm2xSPucACABN0qeSpQLKlVVujwrBXiXY98p3G6TSX9RW5WfOwBgTNWB/Mn1GlPmpIWzaZpNgaVB3hHLkxYDKAK2jjFx2bowVadrEIfT2s8lxPT7A5wQJnDC9rUHY6Gv6Ro4IynZ49a3hGs4GsPqs9++fGzlQx6yCbp4rpZ6y9lP//myIc8mmetnhM5EyzN52zj6rx6V9LMIU+/X7rWKdp6m3ufajp8Tna/McAQf+OwgKWspHEGl8M+WpmK2n7XNmuLtXv6WB+XtGtV7OSslfggO6JezhWyFFs5omNG/jPJYbYEE7e/+8vafNazjptoZDHzgFHOc5p+euhmNCjZfzxloPFeo+9iAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjQ0OjU0KzAwOjAwajt3BwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDo0NDo1NCswMDowMBtmz7sAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    gas : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOLiIXzqY+AAADe0lEQVRo3tWZT0hUQRzHP24WayC2mREmZlltlmnUITQwzJUKokMEHawOURR0q07RPzt4LorIQ3mxP7fIkFLE8mBlBbJCCZlpmhWZhvgHE9vpMj52Zd97OzPuSr8HO2/ezO/7/b7fm/ebebPgbkuo5AOTCIVjkvdcIS0GdFfz06NEHX58Zr0p/WK6tOkFgo+kOBMkuwg4wVoAQrTzW0G4j60kAes4zg2TCDTJOzmg7HlQejaa0EMnAsEvLd8hBIJO504eF5ABAHxsUKbPwwfAV+dubmPgJWWAhxZq+alAv5wjJAHQqiw9wtIZMXoLRkg3EwABJrTpJygzpQcopFGLvoGCuaAHyLEgAwQI0CDrFQQIUGHTmhMLtNsgjLRvNAFQIeut9IJFNLs1JnN7DeNu8y4gKYYe5RziGACjDAKQQSoAfUwDyWRHbb3LQ5oQZgJ3EjTKA0FKTOjPMm1ELxBMc0b3EZzmZlhtkFEF6alkRCDdUr/7AmsR1s9Jlir7L+UU/dYCLV9dwBPp3M4ydWdpPt5KlEeqrtmEEAjGWKFND5DJGALBX7Kid7DLhOVydATZbyQAOigCPJRToyLAL8tiig0FzJjNksYuExrP4rEi2gmY+xS9IPplt9nwPEPGd16l41ajMqc72sxaoiZ687zPhv+5gE284DkbTSDUlmSRlsJjcoF68hmfjwhcJheAHC7og+gL2Bw2z59jS+IFXGOhdZ7M9UQL2MMuAIZkoiphd2IFXJJllZXnLurGILo5Z8JC2dqLFy+9shb9QywumXCfLKuZZJLqWVeVTE/AKlk+A6Bh1tUECPghy71hv/BdC8vGnMfADmvV30yzdV4UtW9cxkCrtfdVSqk8e8orHSjd1/AwHRH1IEf1gHQFDFLMVbkD1k8lxZpbebYW64oo3fWbyWUMmEzHgPGKcf5XRG4RyDaWmOXc7CagJd4RSNwjsNmqsROgsi8cm9kg2j2CPlkGaTMk3k4hAF/U3PLk29uF14jeyyeJ5Fd1fSMd78SwlWdnHiuhacSxXO6RCOo1/35Lo14ihAjoAFRbE+19LQEPLP/begFM5p4E6Nby75betfoJ38MAAkGPlncPAsGAc65xTkQhpnS1WzZFyKnZLTh/AMjknQZ1ZhiCtoA2/MAitmlH4LW2JwBZDBttVQ+z0kwArKGOcS3ycepY7Qb/DxbmLW2s86MUAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjQ2OjM0KzAwOjAwqKGuvQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDo0NjozNCswMDowMNn8FgEAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    cable : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOMjri1WM1AAADr0lEQVRo3uWZWUhUURjHf+NomZZFK1HRQhtFtNC+kCWtBj21QkERpEUPRQ8VFL0EQUQhIVRQUNkCRRtYtjBBWbRjJUSlD65UFmlqZqOnhzlzvPc6cx1n7j0G/efhfvecb77//37nnHuWC/ZIpYQSFhMJkrhAHefwRuQdIZ4jEDSQ3qZnF+4iEAiWOikgVwZtYImtXyJ50lMwxUkBwyiVYX+xKKxXZ24p+gNO0gMMp0xlIXRyO3FD0R92mh5gBOUyfD1pIeivK/ojbtADjFQS6phvqkngqqI/6hY9wCgqlIR5qtTLRUV/HI+bAmA0lUpCqqS/oOhPuE1vllDLXLzkKPqTxLlPDzCeKklZbRh4MT198K8TWMbACAKNYbalpJ7zNLeTVVDGTQqCt8mGZOr7NXOWZACveofr/+XhhU0dRi8QbPCQz0wAsjhOg+vdOIBEMtgGwCOoQSD4pGMcG+ChKDCa4ugGQClCqwBBCQAp8WFdkukXRWA/n/ndXi0Cgc+Uno28ibpb/eFOq3dFKPikfysBcQ68FfxkWuhSmMGoyATscWR4+ZllINtKHQLBAwZbBVj7QBd2Sestz/G3uw8kkUZ/wMs+tYRbwzFpzeU6U2m06wNp8j436sV1LzlnNtJJlrw35WaVOQPWabS/vF6jKUoB3+TDJNBXlgw11Q8zu1sFBJukkegRHIbBWMWm2iJ7AW5gv8Eu4Jp+AZfYSh0APpZbcxsfRcD2I5szjKOKj62r9AiAWp6ErtC0mAyP/0LAar6qiSqPrvoFZNFbWvEsZL1+AVWmu6/mSh2jYCV76QlAMz4u6xfwTk1AIfBfjAJb6GiCbqyTa29BPvn6BVxhgbIFs3lsrNTRBNMNtodp5kodAk4Y7C9cNVfqaIKdnJZLvT+8pka/ACikMFxVhw/Df07AT3kdFEPMIfIabG3b6djaB97I6w4+8CKKLXsCK+QpYinfZZl1Os62E/CRh8wBenAxhhwAnFJWFX0M5W1Ox5k8kS/OWFDAIWXbTsehzgcm8SHGvXGuSnp4hNkdA7xiLOnMIiWqZ68kL9wSPDRaZ0AP1O44cMyqa4PSggBjM3I3/8PUU91HX6oRCMrj8bEG6M5TLvFDE30PVsse5vMwkWcd0AAB+JkMkEFTh5wTN7E5qGQBL7XTvwh8gWs5IR7AUBKB3eq72H0OOpTqDayVViHbETRQTEVo12lK4T2SHGtrL2dV3JX2ruku0JslbGnbsZYch+kDkY9Sw+3AZ5oW/AVirvy2tHVskQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNS0xMlQxNDo1MDo1OCswMDowMGX+YskAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDUtMTJUMTQ6NTA6NTgrMDA6MDAUo9p1AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==',
    datacard : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwONQqLTcVeAAADV0lEQVRo3u3YTWgdVRTA8V+bj6qoSExspAtbrGjctbFQGhUFQ1VoUEFUkFKRBqy7olFo1EVoszB+YHRhiVQFoaILEaxNAi6qixBMu6ofoMUqMRoXpSlp0uZjXGR8ybz3ZnyPzCRdvDM87sy5d9753zPnnjN3iEqbaUHCMWWXVGVt3vUO6xLHX6UlXYDqIrqjDsSMPujJdM0XB5gw6SOf+WCJbq/H7DaRtvniANxtp7o8gG3uTd98YQwsatf+jyZTgBWUKxTgcvhblJkCTUpSPAgHHNQf0bykVb+HVwpgSmee5oQTWcz/CoiBRQ/UulOVRjRojhndgEbN5pw2kzZKX2IRyj8Op++BW3DRpRLuWecam9KeP4MC7SWNbBcYTMvsqgdhBaACUAGoAFQAqhP7blNfZKfUhDoPLMPqnGGT+cqlxajGU465WFaBLu/4OMkDD+q1OTz/u5B02XK9ejcXqhc8sMYh8wLn9WhRk7px8sp5vgd6PY8PdfgnE+MFEgV4xnaB/d5eGePkL8Pt6F5J84WP4KRXcuct2m3BiPcNJf7La3bH9n3vidJQBgUCO3PX3UsWzbyuxHu/TVhw5wpCOSEIxwyEZ895GV/6HI/bpdNZfbEAbbZaE9P3c6k7iEGBI+F5jXGB13N9bwj8lZg1y5GIB6JBeCZs79Jgekk0dLpkva0pAUQkCnAubBvwu+mcfspZNGYPUB+2Y9jo2pz+Opswmj3ArWF70qhab4a9a72lxh9OZQEQDayHVJvFnA6f2KspXAUt6DAf+y8b7Ijt+8Hp0lAW8sAjuesXzObW8oz9ifcOJeSByXLyAId8Fa7bHsc8qxkj+vyYCHBUVWweGC4nDwQC75U2fBmSkAe+wT5dsbPJQKIAn+pCpy+y+ABRCgCvetGsNj85os367AEK83uP77yr2R57cDmDd8LIe3axAjNkm1ZPa9WoVm0mE/+v6sRUuMCAAdyk3tUFvY86YNi+ZZifW0xOySV23HgRbTMmjKTjilXfmlUAVh0gGoT3lHRPaaPKlv6ydrfH0/dAr0CVzTYajS2+TTb4zS/mvJONFxa2I/Gf4g8LdKdrMD8RncF9tjhfZOwN7sevWc19QW40lvjs/1SXLQB3OO5CUeMXfO32tM39CwNkY17V3Pu2AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjUzOjEwKzAwOjAwOWyZVwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDo1MzoxMCswMDowMEgxIesAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    landline : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwONjKIYi4DAAADXklEQVRo3u2ZTUhUURTHf44jWvgZKIgg+LFKKiyyjwkSQtsmQepCF0WBZa0Ma2FE4a6WLQwkwk1mNLsoXUwtrKRMRCQXmUHZx1gqlmU8mNdizkzzns9hvO+OIvh/i3ff/973zv/d8+49Z86ACrLox8Bc9WHwhEwlizacUzAeOc5aH+VREpDvQnyB9dLraiaGmUt4bB57nGh3Atp4mvDYagJOtJoLNGLdBXhX5EsplvYPJvizlgKyuUyrZb2G6KWDyWQIWO6CXAa4ZNsuPDTyir1rI+AWVY4j8+glXb+AiAsKqKUI2EIDACb3+SB92TSRCZTQxVsAfNLTyL6ELZXK2Uc7ME0/wUhXKp0s2TbMTsvNR11svSsdS1wnFSCFHofuI7Z50i/AxOQuwHHHrmrbBCZHgEmdlxYx4aebvzTTFMePo7Rp+fLSOUUdAC0wh4nJR9IAuBp3BgKrsxMHaXzCxGTWQy4AkxjaHp4IDN4BkBfZB8w1NR9jUS0YaUzJ1AQ0U6OUSXippVmHgM2ULILNlEwD3LlAJRxrFXDG/QyoueC3C4uLOgT0MaNoPkiflVBzwRTlVEr8XA0MRljQIQAWeKZ4pw3rvgw3qIDYcBykPsrfZFHYRW5E2QZm4lVIrMlWYimZtULyTdgKW/TfLnzQsUISCF+rzcCM49W8Ja0zmJfW9zj3Kq6CPsqoFvfNck3Yaeo5SQYAS3TzWfgTdLANgBABHuhwgQ64coFGrLsA1Z3Qh48UABbo4ZewpRyTDdrAz5SwWTSRBYDJIIP2R6l8A4cIxSysx8LmWBZckGzh+2PYEAeFdfUNVMnbh3FAzmWWbDmfcmntj2FT7CmMmgC/ZTV3yXmMFzHsc8akdTuGDeK3Psp9OP7CuLAGh9kt3v7Jm+i21MYdCmVEksOxwZDj6PGoyGVY92W4QQVshuPNcKwDUReEXMyEG4QthjxSsd3hquqxehSwE4CvXgI0AjkM0ct8tAztjGLatZjPpUFiZQAqHetd1bZbklOoNdjlYYTz8h3EYmucK10I0cpouFnDsE3bQ8tPz4tJePvX4Yr8/8SiiBIySOeebJbTTEg1s5AKGXNB/rBwiyXeR3eJZbiyouaBpDhiGTx0OZp/KWXtNUEtj5iOmp5jkNMK5YiE8A9nxtEG5fEt9AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNS0xMlQxNDo1NDo1MCswMDowMF/6jNQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDUtMTJUMTQ6NTQ6NTArMDA6MDAupzRoAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='
  }
  ratings : any;
  constructor(
    private _renderer2: Renderer2, 
     @Inject(DOCUMENT) private _document, 
     public todoservice : TodoService,
     private authservice : AuthService,
     private router : Router,
     private  meta : Meta,
     private title : Title, 
     private toastr : ToastrManager,
     private fb: FormBuilder,
     private spinner: NgxSpinnerService,
     public params : Params,
     private location : Location,
     private route : ActivatedRoute
  ) {
    this.spinner.hide();
   }

  ngOnInit() {
    if(this.todoservice.get_param('ref'))
    {
      let ref : any = this.todoservice.get_param('ref');
      this.router.navigate([ref.replace('#', "/").replace('%3D','=').replace('%3F','?').replace('%2F','/').replace('%252F','/').replace('%252F','/')]);
      return false;
    }
    if(this.router.url == '/home#login' || this.router.url == '/home%23login')
    {
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.authservice.authenticate();
    }, 4000);
    }  
  this.fetch_home_data();
  if(!this.get_token())
  {
    this.todoservice.set_user_data({name:''});
  } 
   
    $('#search').focus(function(){
      $('.search-result').removeClass('hide');
    });
    $('#search').focusout(function(){
      $('.search-result').addClass('hide');
    });

    if(document.URL.indexOf('android_asset') === -1)
    {
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.open_model()
      }, 4000);
    }
    this.check_local();
  }

  check_local()
  {
    let bdata = JSON.parse(localStorage.getItem('b_d'));
    if(bdata != null)
    {
      this.mainbanners =  bdata.main;
      this.bottombanners = bdata.bottom;
    }
    let pdata = JSON.parse(localStorage.getItem('p_d'));
    if(pdata != null)
    {
      this.ratings          =  pdata.ratings;
      this.tata_slides      =  pdata.tata; 
      this.airtel_slides    =  pdata.airtel; 
      this.dishtv_slides    =  pdata.dishtv; 
      this.videcone_slides  =  pdata.videocon;
    }
  }
  private _filter(value: string): object {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.title.toLowerCase().indexOf(filterValue) === 0);
  }

  fetch_home_data()
  {   
      let data = {};
      if(this.get_token())
      {
        data = {token : this.get_token()};
      }
      this.spinner.show();
      this.todoservice.fetch_home_data(data)
      .subscribe(
        data => 
        {
          if(!$.isEmptyObject(data))
          {
            let page_data = data.PAGEDATA[0];
            
            if(page_data)
            {
              this.meta.addTag({ name: 'description', content: page_data.metaDesc });
              this.meta.addTag({ name: 'keywords', content: page_data.metaKeyword });
              this.title.setTitle(page_data.metaTitle);
            }
            
            this.banners  = data.banners;
            this.mainbanners =  this.filter_banners('mobile-main-banner',0, 0);
            this.bottombanners = this.filter_banners('mobile_bottom_banner',0, 0);
            let banner_data : any = { main : this.mainbanners,bottom : this.bottombanners} 
            this.todoservice.set_data('b_d',banner_data);
            setTimeout(()=>{   
              this.make_slider();
            }, 200);
            setTimeout(()=>{   
              this.bottom_slider()
            }, 1000);
            
            this.init_page();
            this.fetch_home_products(); 
            $('#mobile').css('display','');  
            $('#select-item').css('display',''); 
            //this.filter_banners('Big Tv');
            this.spinner.hide();
            window.scroll(0,0);
          }
        }
      )  
  }


  init_products()
  {
    if($('#init-product-script'))
    {
      $('#init-product-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-product-script`;
    script.text = `
      $(document).ready(function(){
        var product = $('.product-slider').lightSlider({
          item: 1,
          auto: false,
          pauseOnHover: true,
          loop: true,
          pause: 5000,
          keyPress: true,
          controls: true,
          pager: false,
          enableDrag: true
        });
      });
      $('select').material_select(); 

    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  open_model()
  {
    if($('#init-open_model-script'))
    {
      $('#init-open_model-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-open_model-script`;
    script.text = `
      $(document).ready(function(){
        $('.modal').modal();
        $('#modal-app').modal('open');
      }); 
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  fetch_home_products()
  {
    this.todoservice.fetch_home_products({token : this.get_token()})
    .subscribe(
    data => 
    {
      this.ratings          = data.rating; 
      this.user_cashback    = data.cashback;
      this.all_products     = data.products;
      this.calculate_ratings();
      this.tata_slides      = this.filter_product('tata',data.products); 
      this.airtel_slides    = this.filter_product('airtel',data.products);  
      this.dishtv_slides    = this.filter_product('dish',data.products);  
      this.videcone_slides  = this.filter_product('videocon',data.products); 
      this.recommended      = this.filter_recommended(data.products); 
      this.init_products();
      let product_data : any = { ratings : this.ratings, tata : this.tata_slides,airtel : this.airtel_slides,dish : this.dishtv_slides,videocon : this.videcone_slides} 
      this.todoservice.set_data('p_d',product_data);
    }
    ) 
  }

  check_if_favorite(product_id)
  {
    if(localStorage.getItem('favourite') == null)
    {
      return false;
    }
    let products = JSON.parse(localStorage.getItem('favourite'));
    var exist = products.items.filter(product => product.prod_id == product_id);
   
    if(exist.length > 0)
      return 'orange-text';  
    return ''; 
  }
  add_to_favorite(product)
  {

    $('.wishlist').addClass('active');

    if(!this.get_token())
    {
      $('.logup.modal-trigger')[0].click();
      this.toastr.errorToastr("Please Login to proceed", 'Failed! ');
      return false;
    }

    this.spinner.show() 
    this.todoservice.add_to_favorite({product : product,token : this.get_token()})
    .subscribe(
    data => 
    {
      this.spinner.hide();
      this.toastr.successToastr(data.msg);
      if(data.status == true)
        localStorage.setItem('favourite', JSON.stringify(data.favourites));
    }
    ) 
  }

  product_rating(product_id)
  {
    let rate = this.product_ratings.filter(x => x.id == product_id);
    //console.log(rate)
    return rate;  
  }

  calculate_ratings()
  {
    let j : any = 0;
    let rate : any = 0;
    //console.log(this.ratings);
    for(var i = 0;i < this.all_products.length;i++)
    {
      for(var k = 0;k < this.ratings.length;k++)
      {
        if(this.all_products[i].id == this.ratings[k].product_id)
        {
          rate = Number(rate) + Number(this.ratings[k].reting);
          j = Number(j) + 1;
        }
      }
      if(j == 0)
        j = 1;
      let rating = (rate/j);
      if(rating == 0)
        var prate =  '0';
      else
        var prate = rating.toFixed(1);
      this.product_ratings.push({id : this.all_products[i].id,rate : prate, rate_count : j});
    }  
    //console.log(this.product_ratings);
  }
  
  filter_recommended(categories)
  {
    let slide = categories.filter(x => x.recommended == 1);
    slide = slide.slice(0,8)
    return slide;
  }

  filter_product(key,categories)
  {
    let temp :any = [];
    let new_slides = [];
    for(var i=0;i<categories.length ;i++)
    {
        temp = categories[i];
        let startIndex = temp.title.toLowerCase().indexOf(key.toLowerCase());
        if (startIndex != -1) {
          new_slides.push(categories[i]); 
        }
    }
    return new_slides;
  } 

  
  init_page() 
  {
    if($('#init-page-script'))
    {
      $('#init-page-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-page-script`;
    script.text = `
        $(document).on("click",".recharge-section",function($event) {
          var x = $event.target.nodeName;
          if(!$(x).hasClass("more-clik"))
            $('.dropdown-more').hide();
        });
        $('.tooltipped').tooltip({delay: 50});
        $('.modal').modal();
      // Hide sideNav
      $('.button-collapse1').on('click', function () {
        $('.side-nav').sideNav('hide');
      });
    
      $('.modal-close').on('click', function(){
       $('.modal').modal('close');
      });
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  make_slider()
  {
    if($('#slider-script'))
    {
      $('#slider-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `slider-script`; 
    script.text = `
    $(document).ready(function(){
      $('.mobile-slider').lightSlider({
        item: 1,
        auto: true,
        slideMove: 1,
        loop: true,
        pause: 5000,
        speed : 1200,
        controls: false,
        keyPress: false,
        enableDrag: true,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
        responsive : [],
        onSliderLoad : function()
        {
          $('.mobile-slider li').css('display','block');
        }
      });
    })
      `;
    this._renderer2.appendChild(this._document.body, script);
  }

  bottom_slider()
  {
    if($('#bottom-slider-script'))
    {
      $('#bottom-slider-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `bottom-slider-script`; 
    script.text = `
    $(document).ready(function(){
      $('#bottom-slider').lightSlider({
        item: 1,
        speed : 1200,
        pause : 5000,
        loop:true,
        auto: true,
        controls: false,
        keyPress: false,
        enableDrag: true,
        pager: true,
        gallery: false,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
    });
    })
      `;
    this._renderer2.appendChild(this._document.body, script);
  }

  filter_banners(position,from = 0,limit = 0)
  {
    let banner: any = [];
    let ln = limit;
    if(limit == 0)
    {
      ln =  this.banners.length
    }
   
    for(var i = from; i < this.banners.length ;i++)
    {
        if(this.banners[i].position == position)
        {   
            banner.push(this.banners[i]);
        }
        if(banner.length == ln)
        {
          break;
        }
    } 
    return banner;
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}
