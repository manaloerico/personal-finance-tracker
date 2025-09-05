import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'firebase/auth';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-user-menu',standalone: true,
  templateUrl: './user-menu.component.html',
  imports: [NgIf,MatMenuModule],
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
 @Input() user: User | null = null;
 @Output() logoutEvent = new EventEmitter<void>();

  menuOpen = false;
  defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=40';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    console.log('Logging out...');
    this.logoutEvent.emit(); 
  }

}
