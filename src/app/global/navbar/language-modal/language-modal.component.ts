import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.component.html',
  styleUrls: ['./language-modal.component.scss']
})
export class LanguageModalComponent implements OnInit {
  title: string;
  closeBtnName: string;

  languages = [];
  selected = '';

  public onSelected: Subject<boolean>;

  constructor(
    public bsModalRef: BsModalRef,
    private languageService: LanguageService
  ) { }

  public ngOnInit(): void {
    this.onSelected = new Subject();
    this.languages = this.languageService.getLanguages();
    this.selected = this.languageService.selected;
  }

  select(lng) {
    this.languageService.setLanguage(lng);
    // this.saveSettings();
    // this.popoverCtrl.dismiss();

    this.onSelected.next(true);
    this.bsModalRef.hide();
  }
}
