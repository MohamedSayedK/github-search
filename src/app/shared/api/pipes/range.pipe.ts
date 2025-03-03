import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'range',
    standalone: true
})

export class RangePipe implements PipeTransform{
    transform(total: number, start: number = 0): number[] {
        return Array.from({ length: total }, (_, i) => start + i);
      }
}