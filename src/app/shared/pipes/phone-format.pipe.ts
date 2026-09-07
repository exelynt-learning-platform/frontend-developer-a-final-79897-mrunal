import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {

  transform(_value: unknown, ..._args: unknown[]): unknown {
    return null;
  }

}
