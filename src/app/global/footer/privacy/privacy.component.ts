import { Component, OnInit } from '@angular/core';

import { Entry } from 'contentful';

import { ContentfulService } from './../../../shared/services/contentful.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent implements OnInit {
  contentfulItem: Entry<any>;

  constructor(private cfService: ContentfulService) { }

  ngOnInit() {
    const contentfulId = '1dT2EAqGoQfcRDcXi62YmX';
    this.cfService.getContentDetail(contentfulId).subscribe((result) => {
      this.contentfulItem = result;
      // console.log(this.contentfulItem);
    });
  }

  refresh(): void {
    localStorage.removeItem('rv_privacy');
    window.location.reload();
  }
}
