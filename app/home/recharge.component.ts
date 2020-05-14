import { Component, OnInit,ViewChild ,ViewContainerRef,Renderer2,Inject,} from '@angular/core';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import {Location} from '@angular/common';
import { Params } from '../shared/config/params.service';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Package } from '../packages.entities.service';
import { RechargeType } from '../recharge.type';
import { Meta ,Title} from '@angular/platform-browser';
import { DOCUMENT} from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as $ from 'jquery';
import { element } from 'protractor';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styles: []
})
export class RechargeComponent implements OnInit {
  myControl = new FormControl();
  @ViewChild('operator', {static: false}) moperator;                                                        
  @ViewChild('postoperator', {static: false}) postoperator;                                                        
  @ViewChild('mcircle', {static: false}) mcircle;                                                        
  @ViewChild('dcircle', {static: false}) dcircle;                                                        
  @ViewChild('predataoperator', {static: false}) predataoperator;                                                        
  @ViewChild('postdataoperator', {static: false}) postdataoperator;                                                        
  public userinfo = {wallet:'',phone:'',name:''};
  public operators : any = {};
  public loop : boolean = false;
  public selectedOperator : number ;
  public rechargeAmount : number ;
  public rechargeId : number ;
  public recharge_ini : number = 1;
  public recharge_cart : any;
  promo_selected : number = 0;
  no_dues = 0;
  bill_amt : number;
  due_msg : string = 'No pending dues.';
  rechargeData : any ;
  flash_deals : any;
  tata_slides : any;
  dishtv_slides : any;
  videcone_slides : any;
  airtel_slides : any;
  instant_checked : boolean = true;
  circles : any;
  pay_step : number = 1;
  prepaid_list : number = 1;
  dthminlength : number = 8;
  dthmaxlength : number = 12;
  validationtext : string = '';
  viewrange : number = 0;
  showstd : number = 0;
  mobilegroup : FormGroup;
  dthgroup : FormGroup;
  datacardgroup : FormGroup;
  landlinegroup : FormGroup;
  broadbandgroup : FormGroup;
  electricitygroup : FormGroup;
  testgroup : FormGroup;
  banners : any = [];
  gasgroup : FormGroup;
  watergroup : FormGroup;
  cablegroup : FormGroup;
  order : any = {};
  package_item : Package;
  packages : Package[];
  product_mpackages : Package[];
  promo_codes : any ;
  url_name : string;
  selected_promo : any;
  region : number = 0;
  operator_id : number = 0;
  activity : number = 0;
  plans : any;
  alloperators : any;
  selected_operator : number = 0;
  pagetitle : string;
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: Observable<object>;
  filterdList : boolean = false;
  tab_1 : boolean = false;
  tab_2 : boolean = false;
  electricity_operators :any;
  last_recharges : any;
  dthpattern : string = '';
  services_icons : any = {
    broadband : 'data:image/png;base64,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',
    dth : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOKTnS6vkVAAAEhklEQVRo3sWZa2wUVRTHfy20dClIWUFSQ0LZSiKJChKRKqRRY6RQCYaokRCJxlBDTGglvsEEot80BhWfCGoCIUbw+UHBoBi1VayQkoJQU5RnldJaAkVLaa8f9szd2dl5pTN3PfNh9zzm/P/3zNznQHwyjC30cZaT7OYt7ufKGHOHklpU1jXIbpZSnD8CsxwE0tdRllHoV7b45CSnGEEPF7mMAm0dwwJq+IEz+asEJKjmOdptdTjPknwSSEsB82i0vRFP558CFLCUbk1itWm4aTxGHXcyKctawV5N4QGT8Cn+0UB7WcUY7RnN12K/wLXmCCxydMBO6nUHHMXPYm1huCkCZfyWMwp8xmjxTqRTbA3mapBgNktYzU8Magot+lHcLZbTlJqjYMl0dmoKX+jh7iux1JsnAAWsYkAAnxFbleit+SAA8KQAnmOCWKxX0UBfmMIGjtHHMTZQqa2fCOCLojeIvjJ84iQb2cVtAVF30Wt793tZKPYUfSgUJ2R6mioRn4aFL6UJhaKPBT5R19mGIGvAuUZ8n4vlBtG7UCjawhL4UKf0o/CxbnmzrsR28dWJ/rDo6empP9xCoC6rVV4UiqT93VQCV/G31CA94lXL3WsdZMuC4a+QVEoX2J1CuaPN20UvByAl2uvi3SR6iBXjej2xXM1xHwolMu61UwIkOIJCMUAJAIX8ikJxn0QvRqE4aFszech4eZr9zAAqfSl8J779vMR++f+9rZIrmGuLrmEF44Pb/6gkel90bwoZj/2qDYbwlz2S6GYXIDsFd/jno8KPlXH8gEdbLQp2y2H5d5h7o8JDjePddafgJJSiisnRwQHqJfGDOR47aEeIQWqI8oKkvsnF53zqBuDhTUl+vavXTiEivNeuTcnvRVdvO7dwIp6WehHold9xHv4MhWK2RamBF4Hj8jvF88525vCHprCQmMXqhut8o/wH6EhSJgPR0YBJYxK/awoxV+FHSXxjQJyxKliT0ZbASEMUkpwnva+fGRhr6EG8KkkbKfp/qpCUFaxiU4hoI1V4SA+4T4SItldhboj4UPKBprA+xL6+ktMSfSBE7lCSkI2JQvENU31jL+ddvS3fExeBTHdML1DfIOUaNYGn+EvHdTAtbPrAxTE7uMNhaeYjWmijCyglxUzmMN92JHuQWpklYpCRsinp4ZzL0jP3GuRlRsZXfpgvid+mnI22gxf3ayez4gQHeEVSLwJgnyd0F68FzhquEtS1agDoZxcAO5gOwFaOUEExYznDn7TRSCsDcbcdYLK071vRbxV9swkwN3lEAK1j5iLOolB0+n0BiFOs043M2tg68wmeIWOQYul6HbbRYrkQeDYfBG4XsPdstoqczbdBsXZHi7Osh1AoLpE0T6BVTjqyDxPWCa17TMNPFKAmh32e2N8xTWCZAK1x2BNcQKE4FWIiiyTbhEBVjudL8Rj89gHD5Yiu2+VA0VohPB4HUKaM1ay0fUhIMBuAHppz7kkyA4COrIXXL6zh36ETGUFPqPne7xpSRQo1gVGRqzku2u0NkWowQNPQPtf/B26nB+ucfYIjAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjQxOjU3KzAwOjAwvfqm3gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDo0MTo1NyswMDowMMynHmIAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    mobile : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOJwOKZQ0pAAABeklEQVRo3u2Zv0oDQRCHv8QkoCC2YqIIigQxZV5A9A18gIgIooitryAIdoKdjaClCFYRsfABFMEqjQkE/IMWRjFK1i5c5DLZ20UOcWabu90f8/tu9uaKW+gdaZY55xETYbxwyQb9Ftl7xiQ3kayDo0LB1z5LzdneYLhn3A/g2MveYDj1sZ8KSfhGgUW+mOlQjvDQFSEvWSRFgPmQuT4aNIBEx2zix30w5iSLlAiQC5nLUAHg2rqOWfcKpK1NnB8yaZvltyJloWmy45h9liIIb4clwAebjgDbFAEjSWLfgn8BoFugAAoQO4C2oQIogHaBAiiAdoECKEDsANqGCqAA2gUKoADaBWLY/CselIv4xyvgA/DKOmNMs+sDIG/Bp7i6wgEAawxQEnRN9wrUhLV3jtrX+2KWqjtAWVgzgVezJerO8IgT4Uhyoa3aE1SHPvYwSr1r6mdKDJFji1ZXzR3DfgCQ59b52PaKCV97gAyrXPAUwbhFnTJLNp+5b3gBJOk+a18zAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjM5OjAzKzAwOjAwO7nZ3gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDozOTowMyswMDowMErkYWIAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    // electricity : 'data:image/png;base64,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',
    electricity : 'data:image/png;base64,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',
    water : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOLDY/IhDBAAAEVklEQVRo3sWYW2xUVRSGvzJTpq0FkYJoqYim4C2IaKIlEQlIDC8+GEMsNkF9wGCiIcqT1iuNiQFaIqY2JEZ9MsYrkWDUxJeWqA8goVpLRU2xaAJpLKa12Hamxwf2+edM50xnn8uM6zzMmX32//9rr31be0MUa+EMZ3k4EkcEayKNg0Oapv9DPkUfjnlOUV1+B/ZK3sFhT7nl7zLhd58Md5dTPsWPOfJl74Y9ku2lt/zd0KTwT7KGNUyaf2WaDd7R/yIAL5W3G7Kj/ziVAFRyXGV7Sy2/VuGfYJVKb2VCs2FdKeWrPOFvzfmS7YaBUnZDh2S+N+F3LckxfWsvlbx/+F1brdmQ4Z5SyNcwUCD8rr2i779SG78D7aI/RtK3xlxOlq4bVjM1S/hdu82zKN0Rp3zCM9Ofn7Xmq55VImnJbmG7RPsDc2etmaJfdXfFJX8tYxrfa4vW3sC0qT3G8ngc+FRtesOq/tuq/0kc8ptEN8R8K8RCzglzX1T5pGe/f8ga9ZgwP81YMQPbTlF1U2GNquAb4Z6OIl/HX4ZmilsCIW/Xsn2BxeEdyKZeHYGxXdFXxXrGDcUwC0JE74JBX6QhnANvqg3PhMI/J/zBMPDlynIGSYVyoJoh7Qw3BIcflP+PhAsg8Lg43goKreMfA+0nEdqBJL9oHBSYC3MK+l5j3trJhHYgzX7zVsWOYJ7/bjw/R1VoeYAazospwEh60HL3t7GXxdVsD3pPR69FkR1YolzqA1tIJSMGciSyPMBXhm3Urzv9BuFGrXsfxuKAy1LLvXaAA0o/r4jFgTp1QqcdwN1Kv4tFHtCp6dv8T35d4C6bvREkE2xnnzLIkzOYi0Azxt+2CA7szrmycJP1TP6qmh+BCpVNR3Cg2TTm/hwmn5wq34E0F81b+PNdQgn5JS43mR3PX9b9xsCI+b0mtAOrlIr+AcAy82/YJgLws/kNsYcb26y3EwDcOIO5iHUpjbg8lHyC04ZhhASwSGel1+0i0COiDaEc2EajefuIDLBJg6/bjuAqefx+CPl6hrX/3QnAZ4roQluSHuUxSwLKz/PcFR0CYJnuDL60p9kuktcCyTd47hHGWAFAp0pa7IkuUx4zzvXWqEe1jTs4JgW7We3/M1hu1SqiLwrmjbm2xSPucACABN0qeSpQLKlVVujwrBXiXY98p3G6TSX9RW5WfOwBgTNWB/Mn1GlPmpIWzaZpNgaVB3hHLkxYDKAK2jjFx2bowVadrEIfT2s8lxPT7A5wQJnDC9rUHY6Gv6Ro4IynZ49a3hGs4GsPqs9++fGzlQx6yCbp4rpZ6y9lP//myIc8mmetnhM5EyzN52zj6rx6V9LMIU+/X7rWKdp6m3ufajp8Tna/McAQf+OwgKWspHEGl8M+WpmK2n7XNmuLtXv6WB+XtGtV7OSslfggO6JezhWyFFs5omNG/jPJYbYEE7e/+8vafNazjptoZDHzgFHOc5p+euhmNCjZfzxloPFeo+9iAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjQ0OjU0KzAwOjAwajt3BwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDo0NDo1NCswMDowMBtmz7sAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    // gas : 'data:image/png;base64,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',
    gas : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOLiIXzqY+AAADe0lEQVRo3tWZT0hUQRzHP24WayC2mREmZlltlmnUITQwzJUKokMEHawOURR0q07RPzt4LorIQ3mxP7fIkFLE8mBlBbJCCZlpmhWZhvgHE9vpMj52Zd97OzPuSr8HO2/ezO/7/b7fm/ebebPgbkuo5AOTCIVjkvdcIS0GdFfz06NEHX58Zr0p/WK6tOkFgo+kOBMkuwg4wVoAQrTzW0G4j60kAes4zg2TCDTJOzmg7HlQejaa0EMnAsEvLd8hBIJO504eF5ABAHxsUKbPwwfAV+dubmPgJWWAhxZq+alAv5wjJAHQqiw9wtIZMXoLRkg3EwABJrTpJygzpQcopFGLvoGCuaAHyLEgAwQI0CDrFQQIUGHTmhMLtNsgjLRvNAFQIeut9IJFNLs1JnN7DeNu8y4gKYYe5RziGACjDAKQQSoAfUwDyWRHbb3LQ5oQZgJ3EjTKA0FKTOjPMm1ELxBMc0b3EZzmZlhtkFEF6alkRCDdUr/7AmsR1s9Jlir7L+UU/dYCLV9dwBPp3M4ydWdpPt5KlEeqrtmEEAjGWKFND5DJGALBX7Kid7DLhOVydATZbyQAOigCPJRToyLAL8tiig0FzJjNksYuExrP4rEi2gmY+xS9IPplt9nwPEPGd16l41ajMqc72sxaoiZ687zPhv+5gE284DkbTSDUlmSRlsJjcoF68hmfjwhcJheAHC7og+gL2Bw2z59jS+IFXGOhdZ7M9UQL2MMuAIZkoiphd2IFXJJllZXnLurGILo5Z8JC2dqLFy+9shb9QywumXCfLKuZZJLqWVeVTE/AKlk+A6Bh1tUECPghy71hv/BdC8vGnMfADmvV30yzdV4UtW9cxkCrtfdVSqk8e8orHSjd1/AwHRH1IEf1gHQFDFLMVbkD1k8lxZpbebYW64oo3fWbyWUMmEzHgPGKcf5XRG4RyDaWmOXc7CagJd4RSNwjsNmqsROgsi8cm9kg2j2CPlkGaTMk3k4hAF/U3PLk29uF14jeyyeJ5Fd1fSMd78SwlWdnHiuhacSxXO6RCOo1/35Lo14ihAjoAFRbE+19LQEPLP/begFM5p4E6Nby75betfoJ38MAAkGPlncPAsGAc65xTkQhpnS1WzZFyKnZLTh/AMjknQZ1ZhiCtoA2/MAitmlH4LW2JwBZDBttVQ+z0kwArKGOcS3ycepY7Qb/DxbmLW2s86MUAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjQ2OjM0KzAwOjAwqKGuvQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDo0NjozNCswMDowMNn8FgEAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    cable : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwOMjri1WM1AAADr0lEQVRo3uWZWUhUURjHf+NomZZFK1HRQhtFtNC+kCWtBj21QkERpEUPRQ8VFL0EQUQhIVRQUNkCRRtYtjBBWbRjJUSlD65UFmlqZqOnhzlzvPc6cx1n7j0G/efhfvecb77//37nnHuWC/ZIpYQSFhMJkrhAHefwRuQdIZ4jEDSQ3qZnF+4iEAiWOikgVwZtYImtXyJ50lMwxUkBwyiVYX+xKKxXZ24p+gNO0gMMp0xlIXRyO3FD0R92mh5gBOUyfD1pIeivK/ojbtADjFQS6phvqkngqqI/6hY9wCgqlIR5qtTLRUV/HI+bAmA0lUpCqqS/oOhPuE1vllDLXLzkKPqTxLlPDzCeKklZbRh4MT198K8TWMbACAKNYbalpJ7zNLeTVVDGTQqCt8mGZOr7NXOWZACveofr/+XhhU0dRi8QbPCQz0wAsjhOg+vdOIBEMtgGwCOoQSD4pGMcG+ChKDCa4ugGQClCqwBBCQAp8WFdkukXRWA/n/ndXi0Cgc+Uno28ibpb/eFOq3dFKPikfysBcQ68FfxkWuhSmMGoyATscWR4+ZllINtKHQLBAwZbBVj7QBd2Sestz/G3uw8kkUZ/wMs+tYRbwzFpzeU6U2m06wNp8j436sV1LzlnNtJJlrw35WaVOQPWabS/vF6jKUoB3+TDJNBXlgw11Q8zu1sFBJukkegRHIbBWMWm2iJ7AW5gv8Eu4Jp+AZfYSh0APpZbcxsfRcD2I5szjKOKj62r9AiAWp6ErtC0mAyP/0LAar6qiSqPrvoFZNFbWvEsZL1+AVWmu6/mSh2jYCV76QlAMz4u6xfwTk1AIfBfjAJb6GiCbqyTa29BPvn6BVxhgbIFs3lsrNTRBNMNtodp5kodAk4Y7C9cNVfqaIKdnJZLvT+8pka/ACikMFxVhw/Df07AT3kdFEPMIfIabG3b6djaB97I6w4+8CKKLXsCK+QpYinfZZl1Os62E/CRh8wBenAxhhwAnFJWFX0M5W1Ox5k8kS/OWFDAIWXbTsehzgcm8SHGvXGuSnp4hNkdA7xiLOnMIiWqZ68kL9wSPDRaZ0AP1O44cMyqa4PSggBjM3I3/8PUU91HX6oRCMrj8bEG6M5TLvFDE30PVsse5vMwkWcd0AAB+JkMkEFTh5wTN7E5qGQBL7XTvwh8gWs5IR7AUBKB3eq72H0OOpTqDayVViHbETRQTEVo12lK4T2SHGtrL2dV3JX2ruku0JslbGnbsZYch+kDkY9Sw+3AZ5oW/AVirvy2tHVskQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNS0xMlQxNDo1MDo1OCswMDowMGX+YskAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDUtMTJUMTQ6NTA6NTgrMDA6MDAUo9p1AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==',
    datacard : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwONQqLTcVeAAADV0lEQVRo3u3YTWgdVRTA8V+bj6qoSExspAtbrGjctbFQGhUFQ1VoUEFUkFKRBqy7olFo1EVoszB+YHRhiVQFoaILEaxNAi6qixBMu6ofoMUqMRoXpSlp0uZjXGR8ybz3ZnyPzCRdvDM87sy5d9753zPnnjN3iEqbaUHCMWWXVGVt3vUO6xLHX6UlXYDqIrqjDsSMPujJdM0XB5gw6SOf+WCJbq/H7DaRtvniANxtp7o8gG3uTd98YQwsatf+jyZTgBWUKxTgcvhblJkCTUpSPAgHHNQf0bykVb+HVwpgSmee5oQTWcz/CoiBRQ/UulOVRjRojhndgEbN5pw2kzZKX2IRyj8Op++BW3DRpRLuWecam9KeP4MC7SWNbBcYTMvsqgdhBaACUAGoAFQAqhP7blNfZKfUhDoPLMPqnGGT+cqlxajGU465WFaBLu/4OMkDD+q1OTz/u5B02XK9ejcXqhc8sMYh8wLn9WhRk7px8sp5vgd6PY8PdfgnE+MFEgV4xnaB/d5eGePkL8Pt6F5J84WP4KRXcuct2m3BiPcNJf7La3bH9n3vidJQBgUCO3PX3UsWzbyuxHu/TVhw5wpCOSEIxwyEZ895GV/6HI/bpdNZfbEAbbZaE9P3c6k7iEGBI+F5jXGB13N9bwj8lZg1y5GIB6JBeCZs79Jgekk0dLpkva0pAUQkCnAubBvwu+mcfspZNGYPUB+2Y9jo2pz+Opswmj3ArWF70qhab4a9a72lxh9OZQEQDayHVJvFnA6f2KspXAUt6DAf+y8b7Ijt+8Hp0lAW8sAjuesXzObW8oz9ifcOJeSByXLyAId8Fa7bHsc8qxkj+vyYCHBUVWweGC4nDwQC75U2fBmSkAe+wT5dsbPJQKIAn+pCpy+y+ABRCgCvetGsNj85os367AEK83uP77yr2R57cDmDd8LIe3axAjNkm1ZPa9WoVm0mE/+v6sRUuMCAAdyk3tUFvY86YNi+ZZifW0xOySV23HgRbTMmjKTjilXfmlUAVh0gGoT3lHRPaaPKlv6ydrfH0/dAr0CVzTYajS2+TTb4zS/mvJONFxa2I/Gf4g8LdKdrMD8RncF9tjhfZOwN7sevWc19QW40lvjs/1SXLQB3OO5CUeMXfO32tM39CwNkY17V3Pu2AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTEyVDE0OjUzOjEwKzAwOjAwOWyZVwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0xMlQxNDo1MzoxMCswMDowMEgxIesAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    landline : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfkBQwONjKIYi4DAAADXklEQVRo3u2ZTUhUURTHf44jWvgZKIgg+LFKKiyyjwkSQtsmQepCF0WBZa0Ma2FE4a6WLQwkwk1mNLsoXUwtrKRMRCQXmUHZx1gqlmU8mNdizkzzns9hvO+OIvh/i3ff/973zv/d8+49Z86ACrLox8Bc9WHwhEwlizacUzAeOc5aH+VREpDvQnyB9dLraiaGmUt4bB57nGh3Atp4mvDYagJOtJoLNGLdBXhX5EsplvYPJvizlgKyuUyrZb2G6KWDyWQIWO6CXAa4ZNsuPDTyir1rI+AWVY4j8+glXb+AiAsKqKUI2EIDACb3+SB92TSRCZTQxVsAfNLTyL6ELZXK2Uc7ME0/wUhXKp0s2TbMTsvNR11svSsdS1wnFSCFHofuI7Z50i/AxOQuwHHHrmrbBCZHgEmdlxYx4aebvzTTFMePo7Rp+fLSOUUdAC0wh4nJR9IAuBp3BgKrsxMHaXzCxGTWQy4AkxjaHp4IDN4BkBfZB8w1NR9jUS0YaUzJ1AQ0U6OUSXippVmHgM2ULILNlEwD3LlAJRxrFXDG/QyoueC3C4uLOgT0MaNoPkiflVBzwRTlVEr8XA0MRljQIQAWeKZ4pw3rvgw3qIDYcBykPsrfZFHYRW5E2QZm4lVIrMlWYimZtULyTdgKW/TfLnzQsUISCF+rzcCM49W8Ja0zmJfW9zj3Kq6CPsqoFvfNck3Yaeo5SQYAS3TzWfgTdLANgBABHuhwgQ64coFGrLsA1Z3Qh48UABbo4ZewpRyTDdrAz5SwWTSRBYDJIIP2R6l8A4cIxSysx8LmWBZckGzh+2PYEAeFdfUNVMnbh3FAzmWWbDmfcmntj2FT7CmMmgC/ZTV3yXmMFzHsc8akdTuGDeK3Psp9OP7CuLAGh9kt3v7Jm+i21MYdCmVEksOxwZDj6PGoyGVY92W4QQVshuPNcKwDUReEXMyEG4QthjxSsd3hquqxehSwE4CvXgI0AjkM0ct8tAztjGLatZjPpUFiZQAqHetd1bZbklOoNdjlYYTz8h3EYmucK10I0cpouFnDsE3bQ8tPz4tJePvX4Yr8/8SiiBIySOeebJbTTEg1s5AKGXNB/rBwiyXeR3eJZbiyouaBpDhiGTx0OZp/KWXtNUEtj5iOmp5jkNMK5YiE8A9nxtEG5fEt9AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNS0xMlQxNDo1NDo1MCswMDowMF/6jNQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDUtMTJUMTQ6NTQ6NTArMDA6MDAupzRoAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='
  }
  constructor(
    private _renderer2: Renderer2, 
     @Inject(DOCUMENT) private _document, 
    public todoservice : TodoService,
    private authservice : AuthService,
    public params : Params,
    private router : Router,
    private activatedroute : ActivatedRoute,
    private fb: FormBuilder,
    public spinner : NgxSpinnerService,
    private location : Location,
    public recharge_type : RechargeType,
    private title : Title,
    private meta : Meta,
    private toastr : ToastrManager,
    private vcr: ViewContainerRef,
  ) {
    
      this.url_name = this.activatedroute.snapshot.params['name'];
      this.ini_recharge_tabs(this.url_name);
   
      this.testgroup = this.fb.group({
        'test_id' : [null,Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      });
     spinner.show()
    this.ini_script() ;
    if(this.get_token())
      this.get_last_recharges()  
  }

  check_list(type)
  {
    if(this.url_name.includes(type))
    {
      return 'hide'
    }
    return '';
  }

  pay_amount()
  {
    var wallet_used = '';
    if($('[name="include_wallet"]:checked').length > 0)
      wallet_used = 'wallet';
    if((this.rechargeData.recharge_amount * 1 + this.rechargeData.commission * 1 > this.todoservice.get_user_wallet_amount()) && wallet_used == 'wallet')
    {
      return Math.ceil(this.rechargeData.recharge_amount * 1 - this.todoservice.get_user_wallet_amount());
    }
    return Math.ceil(this.rechargeData.recharge_amount * 1 + this.rechargeData.commission * 1);
  }

  get_last_recharges()
  {
    this.todoservice.get_last_recharges({token : this.get_token(),category: this.url_name})
    .subscribe(
      data => 
      {
        this.last_recharges = data.LAST_RECHARGE;
        this.spinner.hide();  
      }
    ) 
  }

  
  decode_data(data,action)
  {
    let jsondecode : any = [];
    if(data != '')
    {
      jsondecode = JSON.parse(data);
      if(action == 'operator')
      {
        return jsondecode.operator_title;
      }
      else if(action == 'img')
      {
        return jsondecode.operator_image;
      }
    }  
    return '';
  }

  ini_script()
  {
    if($('#init-script'))
    {
      $('#init-script').remove();
    }
	  let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-list-script`;
    script.text = `
   $(document).ready(function(){
    $('.modal').modal();
    $('.tooltipped').tooltip();
    });
    function pack_price(price)
    {
      $('[ng-reflect-name="amount"]').val(price);
    }
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  
  ini_recharge_tabs(tab)
  {
    this.url_name = tab;
    this.show_tab(1)
    this.spinner.show(); 
    this.recharge_type.mobile = false;
    this.recharge_type.dth = false;
    this.recharge_type.electricity = false;
    this.recharge_type.water = false;
    this.recharge_type.gas = false;
    this.recharge_type.broadband = false;
    this.recharge_type.cable = false;
    this.recharge_type.datacard = false;
    this.recharge_type.landline = false;

    this.plans = [];
      if(tab == 'mobile' || tab == 'mobile-postpaid')
      {
        this.pagetitle = "Mobile Recharge & Bill Payments";
        this.recharge_type.mobile = true;

        if(this.operator_id > 0 && this.region > 0)
        {
          this.get_plans(this.region,this.operator_id);
        }
      }
      else if(tab == 'dth-recharge')
      {
        this.pagetitle = "DTH Recharge";
        this.recharge_type.dth = true;
      }
      else if(tab == 'electricity')
      {
        this.pagetitle = "Pay Electricity Bill";
        this.recharge_type.electricity = true;
      }
      else if(tab == 'water')
      {
        this.pagetitle = "Pay Water Bill";
        this.recharge_type.water = true;
      }
      else if(tab == 'gas')
      {
        this.pagetitle = "Pay Gas Bill Payment";
        this.recharge_type.gas = true;
      }
      else if(tab == 'broadband')
      {
        this.pagetitle = "Pay Landline OR Broadband Bill";
        this.recharge_type.broadband = true;
      }
      else if(tab == 'cable')
      {
        this.pagetitle = "Cable TV Recharge OR Bill Payment";
        this.recharge_type.cable = true;
      }
      else if(tab == 'datacard' || tab == 'datacard-postpaid')
      {
        this.pagetitle = "Data Recharge & Bill Payments";
        this.recharge_type.datacard = true;
      }
      else if(tab == 'landline')
      {
        this.pagetitle = "Pay Landline OR Broadband Bill";
        this.recharge_type.landline = true;
      }
      this.fetch_promocode(tab);
      this.fetch_navigate_data(tab);
      this.get_last_recharges();
      
      this.mobilegroup = this.fb.group({
        'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
        // 'test_id' : [null,Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
         'operator' : [null,Validators.compose([Validators.required])],
         recharge_id: new FormControl('', [Validators.required,Validators.minLength(10)]),
        // 'recharge_id' : [null,Validators.compose([Validators.required])], //[null,[Validators.required,Validators.minLength(10),Validators.pattern("[0-9]{10}$")]],
         'circle_area' : [null,Validators.compose([Validators.required])]
       });
       this.dthgroup = this.fb.group({
         'amount' : [null,[Validators.required,Validators.min(50),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required,Validators.pattern(this.dthpattern)])],
        });
        this.datacardgroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          recharge_id: new FormControl('', [Validators.required,Validators.minLength(10)]),
        });
        this.landlinegroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required])]
        });
        this.broadbandgroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          recharge_id: new FormControl('', [Validators.required,Validators.minLength(10)]),
        });
        this.electricitygroup = this.fb.group({
         'circle' : [null],
         'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required])]
        });
        this.gasgroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required])]
        });
        this.watergroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required])]
        });
        this.cablegroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
           'operator' : [null,Validators.compose([Validators.required])],
           'recharge_id' : [null,Validators.compose([Validators.required])]
         });
  } 
  fetch_promocode(tab)
  {
    this.todoservice.fetch_promocode({operator : tab})
    .subscribe(
      data => 
      {
        this.promo_codes = data.OPERATOR_PROMOS;
        //console.log(this.promo_codes)
        this.spinner.hide();  
      }
    ) 
  }
  
  show_tab(action)
  {
    if(action == 1)
    {
      $('#circles-content').addClass('hide');
      $('#promo-content').removeClass('hide');
      $('#promo-content').addClass('active');
      $("#tab-1").addClass('active');
      $("#tab-2").removeClass('active');
      this.tab_1 = true; 
      this.tab_2 = false; 
    }
    else
    {
      $('#circles-content').removeClass('hide');
      $('#promo-content').addClass('hide');
      $('#circles-content').addClass('active');
      $("#tab-1").removeClass('active');
      $("#tab-2").addClass('active');
      this.tab_1 = false; 
      this.tab_2 = true; 
    }
  }
  fetch_navigate_data(page)
  {
    this.todoservice.fetch_page_data({page : page})
    .subscribe(
      data => 
      {
        if(data.PAGEDATA) 
        {
          $('#short-content').html(data.PAGEDATA[0].shortDescription);
          $('#long-content').html(data.PAGEDATA[0].description);
          //$('#page-title').html(data.PAGEDATA[0].title);
          this.meta.addTag({ name: 'description', content: data.PAGEDATA[0].metaDesc });
          this.meta.addTag({ name: 'keywords', content: data.PAGEDATA[0].metaKeyword });
          this.title.setTitle(data.PAGEDATA[0].metaTitle);
          window.scroll(0,0); 
        }
        this.spinner.hide();  
      }
    ) 
  }
  htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,'&gt;').replace(/"/g, '&quot;');
  }
  navigate_to(tab)
  {
    this.ini_recharge_tabs(tab);
  }

  changeOperator(data,s)
  {
    //console.log(data);
    $('.additional-text').remove()
    this.viewrange = 1;
    var operatordata = this.alloperators.filter(x => x.id == data);

    if(operatordata.amount_type == 1)
    {
      var commission = operatordata.commission;
      var type = '%';
    }
    else
    {
      var commission = operatordata.commission;
      var type = '';
    }
    var text = '';
    if(operatordata.commission_type == 1)
    {
      text = "Congrates! "+commission+type+" Amount will be Credited.";
    }
    else
    {
      text = "Additional "+commission+type+" Amount will be Deducted.";
    }
    
    
    if(commission > 0)
    {
      if(operatordata.commission_type == 1 && this.todoservice.get_user_type() == 2)
        $("#"+s+"-form .btn-flat").parent().before("<div class='col m12 green-text additional-text'>"+text+"</div>");
      else if(operatordata.commission_type == 2)
      {
        $("#"+s+"-form .btn-flat").parent().before("<div class='col m12 red-text additional-text'>"+text+"</div>");
      }
    }  
      
    this.selectedOperator = data;
    this.mobilegroup.controls['circle_area'].setValue(0);
    if(s == 'mobile')
    {
      this.operator_id = operatordata.recharge_id;
      this.mcircle.open();
      this.filter_operator_name(this.selectedOperator);
    }
    else if(s == 'dth')
    {
      if(data == 68)
      {
        this.validationtext = "Please Enter Registered Mobile No./ Viewing Card No.";
        this.dthpattern = "[6-9][0-9]{9}$|[0][0-9]{10}$";
      }else if(data == 69)
      {
        this.validationtext = "Please Enter 11 digits long Smart Card Number .";
        this.dthpattern = "[0-9]{11}$";
      }else if(data == 71)
      {
        this.dthpattern = "[1][0-9]{9}$";
        this.validationtext = "Subscriber ID starts with 1 and 10 digits long. To locate it, press the home button on remote.";
      }else if(data == 72)
      {
        this.dthpattern = "[0-9]{10}$";
        this.validationtext = "Know your Customer ID SMS 'ID' to 566777 from your registered mobile number.";
      }else if(data == 74)
      {
        this.dthpattern = "[3][0-9]{9}$";
        this.validationtext = "Customer ID starts with 3 and is 10 digits long. To locate it, press the MENU button on remote";
      }
    }
    else if(s == 'card')
    {
      this.dcircle.open();
      this.filter_operator_name(this.selectedOperator);
    }
    else if(s == 'landline')
    {
      this.showstd = 1;
    }
  }
    change_list(val)
  {
    if(val == 1)
    {
      $('#prepaid-list').removeClass('hide');
      $('#postpaid-list').addClass('hide');
      this.moperator.open();
    }
    else if(val == 2)
    {
      $('#postpaid-list').removeClass('hide');
      $('#prepaid-list').addClass('hide');
      this.postoperator.open();
    }
    else if(val == 3)
    {
      $('#post-datacard-list').addClass('hide');
      $('#pre-datacard-list').removeClass('hide');
      this.predataoperator.open();
    }
    else if(val == 4)
    {
      $('#post-datacard-list').removeClass('hide');
      $('#pre-datacard-list').addClass('hide');
      this.postdataoperator.open();
    }

  }
  ngOnInit() {
    let data = {token : ''};
      this.todoservice.fetch_operators(data)
      .subscribe(
        data => 
        {
            this.alloperators = data.ALLOPERATORS;
            this.operators = data.ALLOPERATORS;
            this.circles  = data.CIRCLES;
            this.spinner.hide();
            let recharge_data  = this.todoservice.get_recharge();
            if(recharge_data == null)
              return false;
            if(recharge_data && !recharge_data.operator_id )
            {
              localStorage.removeItem('recharge_cart');
              return false;
            }
            this.recharge_cart = recharge_data;
            if(recharge_data.circle_id != null)
              this.region        = recharge_data.circle_id;
            if(this.recharge_cart != null)
            {
              //console.log(this.recharge_cart);
              if(this.recharge_cart.recharge_type == 'mobile')
              {
                this.mobilegroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.mobilegroup.controls['operator'].setValue(recharge_data.operator_id);
                this.mobilegroup.controls['circle_area'].setValue(this.region);
                this.mobilegroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'dth')
              {
                this.dthgroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.dthgroup.controls['operator'].setValue(recharge_data.operator_id);
                this.dthgroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'datacard')
              {
                this.datacardgroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.datacardgroup.controls['operator'].setValue(recharge_data.operator_id);
                this.datacardgroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'landline')
              {
                this.landlinegroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.landlinegroup.controls['operator'].setValue(recharge_data.operator_id);
                this.landlinegroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'broadband')
              {
                this.broadbandgroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.broadbandgroup.controls['operator'].setValue(recharge_data.operator_id);
                this.broadbandgroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'electricity')
              {
                this.electricitygroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.electricitygroup.controls['operator'].setValue(recharge_data.operator_id);
                this.electricitygroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'gas')
              {
                this.gasgroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.gasgroup.controls['operator'].setValue(recharge_data.operator_id);
                this.gasgroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'water')
              {
                this.watergroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.watergroup.controls['operator'].setValue(recharge_data.operator_id);
                this.watergroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              
            }
           
            this.selectedOperator = Number(recharge_data.operator_id);
            this.filter_operator_name(recharge_data.operator_id);
            this.filter_circle_name(Number(recharge_data.circle_id));
            if(this.region > 0 && recharge_data.operator_id > 0)
            {
              var operators = this.alloperators.filter(x => x.id == recharge_data.operator_id);
              //console.log(operators)  
              if(this.activity != recharge_data.activity_id)
                this.get_plans(this.region,operators[0].recharge_id);   
              this.operator_id = operators[0].recharge_id;  
            } 
            
            this.activity = recharge_data.activity_id;

        }
      )
  }

  filter_operators(filter_id)
  {
    if( this.alloperators)
    {
      var operators = this.alloperators.filter(x => x.parent_id == filter_id);
      return operators;
    }
    
  }

  show_operator(type)
  {
    if(type == 'prepaid')
    {
      $('#prepaid-list').removeClass('hide');
      $('#postpaid-list').addClass('hide');
      this.navigate_to('mobile');
    }
    else
    {
      $('#prepaid-list').addClass('hide');
      $('#postpaid-list').removeClass('hide');
      this.navigate_to('mobile-postpaid');
    }
  }
  recharge_init(s,formdata)
  {
    if(s == 'mobile' && !this.mobilegroup.valid)
    {
      Object.keys(this.mobilegroup.controls).forEach(field => { // {1}
        const control = this.mobilegroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'dth' && !this.dthgroup.valid)
    {
      Object.keys(this.dthgroup.controls).forEach(field => { // {1}
        const control = this.dthgroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'datacard' && !this.datacardgroup.valid)
    {
      Object.keys(this.datacardgroup.controls).forEach(field => { // {1}
        const control = this.datacardgroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'landline' && !this.landlinegroup.valid)
    {
      Object.keys(this.landlinegroup.controls).forEach(field => { // {1}
        const control = this.landlinegroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'broadband' && !this.broadbandgroup.valid)
    {
      Object.keys(this.broadbandgroup.controls).forEach(field => { // {1}
        const control = this.broadbandgroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'electricity' && !this.electricitygroup.valid)
    {
      Object.keys(this.electricitygroup.controls).forEach(field => { // {1}
        const control = this.electricitygroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'gas' && !this.gasgroup.valid)
    {
      Object.keys(this.gasgroup.controls).forEach(field => { // {1}
        const control = this.gasgroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'water' && !this.watergroup.valid)
    {
      Object.keys(this.watergroup.controls).forEach(field => { // {1}
        const control = this.watergroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'cable-tv' && !this.cablegroup.valid)
    {
      Object.keys(this.cablegroup.controls).forEach(field => { // {1}
        const control = this.cablegroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
   // console.log(formdata)
    if(formdata.amount <= 0 || formdata.recharge_id.id <= 0 || formdata.operator <= 0 )
		{
      return false;
    }
    this.spinner.show();
    //console.log(formdata)	
		this.rechargeData = {token : this.get_token(),recharge_amount: formdata.amount,recharge_id:formdata.recharge_id,operator_id:formdata.operator,circle_id: formdata.circle_area};
    if(!this.authservice.authenticate())
    {
      $('.logup.modal-trigger')[0].click();
      var time = new Date();
      this.rechargeData.recharge_type = s;
      this.rechargeData.time = time.getTime();
      this.addto_recharge_cart(this.rechargeData);
      this.spinner.hide();
      return false;
    }
    
    this.todoservice.recharge_init(this.rechargeData)
		.subscribe(
			data => 
			{
        this.spinner.hide();
        window.scroll(0,0);
        if(data.comm_p)
          this.rechargeData.commission = data.comm_p;
        else
          this.rechargeData.commission = 0; 
        this.rechargeData.operator_api_id = data.recharge_id;
        this.rechargeData.recharge_type = s;
       
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          return false;
			  //	this.router.navigate(['/login']);
        }
        this.ini_script();
			  if(!$.isEmptyObject(data))
			  {
          if(data.record_exist)
          {
            this.rechargeData.record_exist = data.record_exist
          }
				this.rechargeData.api_img = data.api_img;	
				this.rechargeData.cat_title = data.cat_title;	
				this.rechargeData.recharge_name = data.recharge_name;	
				this.rechargeData.title = data.title;
        this.recharge_ini = 2;				
			  }
			}
		  );
		
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
        $('#login-modal').modal('open');
      }); 
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
recharge_handle()
 {
  if(!this.authservice.authenticate())
  {
      var width = $(window).width(); 
      if(width < 767)
      {
        this.open_model()
      }
      return false;
  }
  this.spinner.show();
  this.rechargeData.payment_type = $('[name="payment_type"]:checked').val();
  if($('[name="include_wallet"]:checked').length > 0)
    this.rechargeData.include_wallet = 1;

	this.todoservice.recharge_handler(this.rechargeData)
	.subscribe(
        data => 
        {
          this.spinner.hide();
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            return false;
          }
          if(data.status == "false")
          {
            this.toastr.errorToastr(data.msg);

            return false;
          }
          if(!$.isEmptyObject(data))
          {
            if(typeof data.red_auth != 'undefined' && data.red_auth == 'ptm')
            {
              window.location.href = "https://www.mydthshop.com/web-app/do-paytm/recharge-index.php?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.pt_amount;
            }
            else if(typeof data.red_auth != 'undefined' && data.red_auth == 'card')
            {
              window.location.href = "https://www.mydthshop.com/accounts/apis/response/recharge_pay/?order_id="+data.order_id;
            }
          else
          {
            this.router.navigate(['/orders/recharge-receipt/'+data.order_id]);
          } 
          } 
          //this.todoservice.service_url = this.todoservice.server_url+'index.php?/app_services/';
        }
      )
 }

  addto_recharge_cart(data)
  {
    localStorage.setItem('recharge_cart',JSON.stringify(data));
  }

  copy_promo(name)
  {
    $('#place-promocode').val(name);
    //this.apply_promo();
  }
  promoselected(promo)
  {
    $('#response-code').text('');
    this.selected_promo = promo;
    this.copy_promo(this.selected_promo.unique_code);

    if(Number(this.selected_promo.min_pay) > Number(this.rechargeData.recharge_amount))
    {
      $('#response-code').text('This Promocode is applicable for Minimum Amount of Rs. '+this.selected_promo.min_pay);
      return false;
    }
  }
  apply_promo()
  {
    let name = $('#place-promocode').val();
    if(name == '' || name == null )
    {
      $('#response-code').text('Please Enter Promo code');
      return false;
    }
    $('#apply-promo').text('WAIT..');
    this.todoservice.apply_promo_code({token:this.get_token(),promo: name,recharge_data : this.rechargeData})
		.subscribe(
			data => 
			{
        this.spinner.hide();
        $('#apply-promo').text('APPLY');
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          return false;
			  //	this.router.navigate(['/login']);
        }
        
			  if(!$.isEmptyObject(data))
			  {
          if(data.status == true)
          {
            $('.modal-close').click();
            this.promo_selected = 1;
            this.rechargeData.promo_key = data.promo_key; 
          }
          else
          {
            $('#response-code').text(data.response);
          }
			  }
			}
		  );
  }
  filter_operator(value)
  { 
    if(value > 0){
      $('.inner-electricity').removeClass('hide');
      this.electricity_operators = this.filter_operators(61);
      this.electricity_operators = this.electricity_operators.filter(x => x.circle_id == value);
    }
  }
check_amount(s)
 {
  let v = $('#'+s+'-form [formcontrolname="recharge_id"]').val();
  if( typeof this.selectedOperator != 'undefined' || v != '')
  {
    $('#'+s+' .calc-amount-btn').text('Please Wait...');
    let data : any = {phone: v,operator: this.selectedOperator};
    this.spinner.show();
    this.todoservice.check_amount(data)
	  .subscribe(
        data => 
        {
          this.spinner.hide();
          $('#'+s+' .calc-amount-btn').text('PROCEED');
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          if(!$.isEmptyObject(data))
          {
            if(data.status == 1)
            {
              if(data.amount > 0)
              {
                this.bill_amt = data.amount;
                if(s == 'landline')
                {
                  this.landlinegroup.controls['amount'].setValue(this.bill_amt);
                }
                else if(s == 'electricity')
                {
                  this.electricitygroup.controls['amount'].setValue(this.bill_amt);
                }
                else if(s == 'gas')
                {
                  this.gasgroup.controls['amount'].setValue(this.bill_amt);
                }
                else if(s == 'water')
                {
                  this.watergroup.controls['amount'].setValue(this.bill_amt);
                }
                
                $('#'+s+' .electric-cls1').removeClass('m5');
                $('#'+s+' .electric-cls2').removeClass('m5');
                $('#'+s+' .electric-cls-btn').addClass('hide');
                $('#'+s+' .electric-cls3').removeClass('hide');
                $('#'+s+' .electric-cls1').addClass('m3');
                $('#'+s+' .electric-cls2').addClass('m4');
              }
            }  
            else if(data.status == 2)
            {
              alert(data.message);
              this.due_msg = data.message;
            }
            else
            {
              alert('Someting Wrong. Try later');
            }
          }
        }
      )
  }
  else
  {
    alert('Enter a valid Number and Provider');
  }
 }
 
 next_to(s,control,e)
 {
  if(s == 'mobile')
  {
    this.mobilegroup.controls['recharge_id'].setValue(e.target.value);
    //console.log(this.mobilegroup.controls['recharge_id'].value)
   if( this.check_if_not_digits(e))
   {
     this.mobilegroup.controls['recharge_id'].setValue(e.target.value.replace(/\D/g,''));
   }
   let recharge_id = e.target.value;
   if(recharge_id.length <= 2)
     return false;
   this.todoservice.check_if_recharge_exist({recharge_id: recharge_id})
   .subscribe(
     data => 
     {
       let recharge_data = data.RECHARGEID;
       if(!$.isEmptyObject(recharge_data))
       {
        this.filterdList = true;
        this.filteredOptions = recharge_data;
        
        }
       else
       {
         if(control == 'recharge_id' && this.mobilegroup.controls[control].valid && !this.operators.selected)
         {
           if($('.mobile-recharge-type:checked').val() == 1)
           {
             this.moperator.open();
           }
           else{
             this.postoperator.open();
           }
         }
       }
       this.spinner.hide();
     }
   )  
   
  }
   else if(s == 'dth')
   {
    if( this.check_if_not_digits(e))
    {
      this.dthgroup.controls['recharge_id'].setValue(e.target.value.replace(/\D/g,''));
    }
   }
   else if(s == 'datacard')
   {
    if( this.check_if_not_digits(e))
    {
      this.datacardgroup.controls['recharge_id'].setValue(e.target.value.replace(/\D/g,''));
    }
    if(control == 'recharge_id' && this.datacardgroup.controls[control].valid)
    {
      
      if($('.data-card-type:checked').val() == 1)
      {
        this.predataoperator.open();
      }
      else{
        this.postdataoperator.open();
      }
    }
   }
   else if(s == 'datacard')
   {
    
   }  
 }
 selected_recharge(recharge_data)
 {
   //console.log(recharge_data)
  this.region  = recharge_data.address_id;
  var decode_data = JSON.parse(recharge_data.order_data);
  this.mobilegroup.controls['recharge_id'].setValue(recharge_data.subcriber_id);
  this.mobilegroup.controls['operator'].setValue(Number(decode_data.operator_id));
  this.selected_operator = decode_data.operator_id;
  this.mobilegroup.controls['circle_area'].setValue(this.region);
  this.mobilegroup.controls['amount'].setValue(recharge_data.grand_total);
  this.selectedOperator = Number(recharge_data.operator_id);
  this.filter_operator_name(recharge_data.operator_id);
  this.filter_circle_name(Number(recharge_data.circle_id));
  if(this.region > 0 && recharge_data.operator_id > 0)
  {
  if(this.activity != recharge_data.activity_id)
    this.get_plans(this.region,decode_data.api_id);
  } 
  this.operator_id = decode_data.api_id;
  this.activity = recharge_data.activity_id;
 }
 
 get_plans(circle,operator)
 {
   //console.log(operator);
  if(this.url_name != 'mobile')
    return true; 
  if(operator == 'get')
   {
    // console.log(this.operator_id)
    operator = this.operator_id;
   }
    
    this.todoservice.get_plans({circle:circle,operator:operator})
		.subscribe(
			data => 
			{
        this.plans = data;
        if(this.plans.length > 0 )
        {
          this.show_tab(2);
          this.print_plan(this.plans[0].records,0);
          
          setTimeout(()=>{    //<<<---    using ()=> syntax
            if($('#list-0 a'))
              $('#list-0 a')[0].click();
       }, 600);
        }
          
      }    
		  );
 } 

 print_plan(data,id)
  {
    
    $("#circles-content li").removeClass('active');
    $("#list-"+id).addClass('active');
    var plan_list = '';
    for(var i=0;i<data.length;i++)
    {
      plan_list += '<tr><td>'+data[i].desc+'</td><td>'+data[i].validity+'</td><td><a class="pack-price" href="javascript:" onclick="pack_price('+data[i].rs+')">'+data[i].rs+'</a></td></tr>';
    }
    $('#print-data').html(plan_list);
  }

 filter_circle_name(id)
 {
  this.circles.selected = this.circles.filter(x => x.circle_id == id);
 } 

 filter_operator_name(id)
  {
  let operator = this.alloperators.filter(x => x.id == id);
  if(operator.length == 0)
    return false;
  this.operators.selected = operator;
  this.operator_id = operator[0].recharge_id;
  }

 check_if_not_digits(dig)
 {
  let evt = (dig) ? dig : event;
  var charCode = (dig.charCode) ? dig.charCode : ((dig.keyCode) ? dig.keyCode :
     ((dig.which) ? dig.which : 0));
  if (charCode > 31 && (charCode < 65 || charCode > 90) &&
     (charCode < 97 || charCode > 122)) {
     return false;  
  }
  return true;
 } 
 copyToClipboard(): void {
  $('#inputcopyId').select();
  document.execCommand('copy');
}
  get_token()
  {
    return this.authservice.auth_token();
  }
}
