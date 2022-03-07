import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2pbr'
})
export class Nl2pbrPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // return value.replace(/\n/g, '<br />');
    //value = value.replace(/(?:\r\n\r\n|\r\r|\n\n)/g, '</p><p>');
    //console.log(value.replace(/(?:\r\n|\r|\n|rn)/g, '<br>'));
    return  value.replace(/(?:\r\n|\r|\n|rn)/g, '<br>');
  }

}