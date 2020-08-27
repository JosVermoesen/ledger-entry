import { Component } from '@angular/core';

import { version } from './../../../../package.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  version: string = version;
  year = new Date().getFullYear();
}
