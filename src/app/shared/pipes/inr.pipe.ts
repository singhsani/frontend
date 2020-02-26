import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inr'
})
export class InrPipe implements PipeTransform {
  transform(value: any, currency: string, symbol: boolean = false): any {
    if (!isNaN(value)) {
      var result = value.toString().split('.');

      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != '')
        lastThree = ',' + lastThree;
      var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

      if (result.length > 1) {
        output += "." + result[1];
      } else {
        output += ".00";
      }
      return currency + output;
    }
    //if (value != null)
    //return this.currencyPipe.transform(value, currency, symbol);
    //return this.currencyPipe.transform(0, currency, symbol).split('0.00')[0];
  }

}
