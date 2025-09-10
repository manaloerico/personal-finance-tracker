import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'personal-finance-tracker';
  protected readonly overlayContainer = inject(OverlayContainer);

  ngOnInit() {
    this.overlayContainer
      .getContainerElement()
      .classList.add('finance-app-theme');
  }
}
