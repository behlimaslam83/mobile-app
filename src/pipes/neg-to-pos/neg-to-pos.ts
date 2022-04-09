import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NegToPosPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'negToPos',
})
export class NegToPosPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(val: number): number {
    return Math.abs(val);
  }
//   transform(value: any, args?: any): any {
//     return value.charAt(0) === '-' ?
//        '(' + value.substring(1, value.length) + ')' :
//        value;
// }
}
