import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, filter, displayKey): any {
    if (filter) {
      return value.filter(item => item[displayKey].indexOf(filter) !== -1);
    }
    return value;
  }
}