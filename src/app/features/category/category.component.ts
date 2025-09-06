import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports : [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  ngOnInit(): void { 
    this.categoryService.initRealtime();   
  }
  newCategory = '';
  protected categoryService = inject(CategoryService);  
  categories$ = this.categoryService.categories$;
  async addCategory() {
    if (!this.newCategory) return;
    await this.categoryService.addCategory({ categoryName: this.newCategory });
    this.newCategory = '';
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }

}
