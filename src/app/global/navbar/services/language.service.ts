import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  constructor(private translate: TranslateService) { }

  setInitialAppLanguage() {
    const language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    const val = localStorage.getItem(LNG_KEY);
    if (val) {
      this.setLanguage(val);
      this.selected = val;
    }
  }

  getLanguages() {
    return [
      {
        text: 'Nederlands',
        subtext: 'Vlaanderen, Brussel',
        value: 'nl',
        img: 'assets/images/flags/nl_small.png',
        enabled: true
      },
      {
        text: 'Français',
        subtext: 'La Wallonie, Bruxelles',
        value: 'fr',
        img: 'assets/images/flags/fr_small.png',
        enabled: false
      },
      {
        text: 'Deutsch',
        subtext: 'Ostbelgien',
        value: 'de',
        img: 'assets/images/flags/de_small.png',
        enabled: false
      },
      {
        text: 'English',
        subtext: '',
        value: 'en',
        img: 'assets/images/flags/en_small.png',
        enabled: false
      }
    ];
  }

  setLanguage(lng) {
    this.translate.use(lng);
    this.selected = lng;
    localStorage.setItem(LNG_KEY, lng);
  }
}
