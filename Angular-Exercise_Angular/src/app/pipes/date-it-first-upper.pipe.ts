import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dateItFirstUpper'})
export class DateItFirstUpperPipe implements PipeTransform {
  public transform(value: string): string {
    let first = value[0];
    first = first.toUpperCase();
    return first + value.slice(1,value.length);
  }
}