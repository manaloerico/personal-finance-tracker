import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  imports: [NgIf, NgFor, MatProgressSpinnerModule, NgSwitch, NgSwitchCase],
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  @Input() mode: 'spinner' | 'skeleton' = 'spinner';
  @Input() diameter = 40; // spinner size
  @Input() count = 3; // number of skeleton rows
  @Input() height = 20; // skeleton row height

  createArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
