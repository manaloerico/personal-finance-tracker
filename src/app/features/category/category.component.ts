import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { tap } from 'rxjs';
import { Category } from '../../core/services/category/category.service';
import { SearchFilterPipe } from '../../shared/pipe/search-filter/search-filter.pipe';
import { CategoryStoreService } from './store/category.store';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SearchFilterPipe,
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [CategoryStoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit {
  readonly dialog = inject(Dialog);
  protected categoryStore = inject(CategoryStoreService);

  protected fb = inject(FormBuilder);
  protected categorySearchForm = this.fb.group({
    categorySearchField: [''],
  });

  ngOnInit(): void {
    console.log('OnInit category component');
    this.categoryStore.getTransactionTypeList();
    this.categoryStore.getCategoryList();
  }
  categories$ = this.categoryStore.categoryList$.pipe(
    tap((list) => {
      console.log('Category List:', list);
    })
  );
  addCategory() {
    this.categoryStore.openDialog({ action: 'add' });
  }

  deleteCategory(id: string) {
    this.categoryStore.deleteCategory(id);
  }

  updateCategory(cat: Category) {
    this.categoryStore.openDialog({ action: 'update', currentData: cat });
  }
}
