import { Injectable } from '@angular/core';

const THEME_KEY = 'finance-theme';
type ThemeName =
  | 'indigo-pink'
  | 'deeppurple-amber'
  | 'pink-bluegrey'
  | 'purple-green';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme: ThemeName = 'indigo-pink';

  constructor() {
    const stored = localStorage.getItem(THEME_KEY) as ThemeName | null;
    if (stored) {
      this.currentTheme = stored;
    }
  }

  get theme(): ThemeName {
    return this.currentTheme;
  }

  setTheme(name: ThemeName): void {
    this.currentTheme = name;
    localStorage.setItem(THEME_KEY, name);
  }
}
