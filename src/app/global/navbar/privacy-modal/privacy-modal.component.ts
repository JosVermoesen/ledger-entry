import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-privacy-modal',
  templateUrl: './privacy-modal.component.html',
})
export class PrivacyModalComponent implements OnInit {
  title: string;
  closeBtnName: string;

  typeCookiesAndPrivacy: string;

  public onSelected: Subject<boolean>;

  accordeonOneAtATime = true;
  accordeonBasicOpen = true;

  constructor(public bsModalRef: BsModalRef, private router: Router) { }

  ngOnInit() { }

  onAcceptPrivacy() {
    localStorage.setItem('rv_privacy', this.typeCookiesAndPrivacy);
    this.bsModalRef.hide();
  }

  onPrivacy() {
    this.router.navigate(['/privacy']);
    this.bsModalRef.hide();
  }

  logSelected(selectedType: string) {
    this.typeCookiesAndPrivacy = selectedType;
  }
}
