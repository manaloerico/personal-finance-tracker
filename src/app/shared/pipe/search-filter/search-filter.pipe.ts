import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true,
})
export class SearchFilterPipe implements PipeTransform {
  transform<T>(items: T[], searchText: string, field: keyof T): T[] {
    if (!items || !searchText) return items;
    const lower = searchText.toLowerCase();
    return items.filter((item) =>
      String(item[field]).toLowerCase().includes(lower)
    );
  }
}
