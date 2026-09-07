import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase'
})
export class TitleCasePipe implements PipeTransform {

  transform(_value: unknown, ..._args: unknown[]): unknown {
    return null;
  }

}
