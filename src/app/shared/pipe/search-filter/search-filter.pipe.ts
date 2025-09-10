import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true,
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, field: string): any[] {
    if (!items || !searchText) return items;

    const lower = searchText.toLowerCase();

    return items.filter((item) => {
      // Support nested paths like "category.categoryName"
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return String(value ?? '')
        .toLowerCase()
        .includes(lower);
    });
  }
}
