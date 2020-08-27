import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { faHandSpock, faBars, faGlobe, faHome } from '@fortawesome/free-solid-svg-icons';

import { LanguageModalComponent } from './language-modal/language-modal.component';
import { PrivacyModalComponent } from './privacy-modal/privacy-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  bsModalRef: BsModalRef;

  faBars = faBars;
  faGlobe = faGlobe;
  faHandSpock = faHandSpock;
  faHome = faHome;

  constructor(
    private modalService: BsModalService,
    private ts: TranslateService
  ) { }

  ngOnInit() {
    const cpStatus = localStorage.getItem('rv_privacy');
    if (!cpStatus) {
      this.privacyModal();
    }
  }

  privacyModal() {
    console.log('no policies viewed yet!');
    const lblTitle = 'Cookies en Privacy';
    const lblCloseBtnName = 'Sluiten';

    const initialState = {
      title: lblTitle,
    };
    this.bsModalRef = this.modalService.show(PrivacyModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = lblCloseBtnName;
  }

  onLanguageModal() {
    const lblTitle = this.ts.instant('NAVBAR.LanguageModalTitle');
    const lblCloseBtnName = this.ts.instant('NAVBAR.LanguageModalCloseBtnName');

    const initialState = {
      title: lblTitle,
    };
    this.bsModalRef = this.modalService.show(LanguageModalComponent, {
      initialState,
    });
    this.bsModalRef.content.onSelected.subscribe(() => {
      // when closed do something eventualy
    });

    this.bsModalRef.content.closeBtnName = lblCloseBtnName;
  }
}
