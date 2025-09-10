import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/service/auth.service';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserMenuComponent } from '../../shared/components/user-menu/user-menu.component';
import { ThemeService } from '../../shared/styles/theming/theme.service';
@Component({
    selector: 'app-authenticated',
    templateUrl: './authenticated.component.html',
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatButtonModule,
        UserMenuComponent,
        MatMenuModule,
    ],
    styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {
  isDark = true;
  hovered = false;
  protected auth = inject(AuthService);
  protected theme = inject(ThemeService);

  ngOnInit(): void {
    console.log(this.auth.user());
  }
  logout() {
    this.auth.logout();
  }
}
