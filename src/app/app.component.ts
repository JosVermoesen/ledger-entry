import { Component, OnInit } from '@angular/core';
import { BasketService } from './modules/ledger-entry/services/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    // check open redis session for ledgerEntry
    const ledgerEntryId = localStorage.getItem('ledgerEntry_id');
    localStorage.setItem('redisNotRunning', ledgerEntryId);
    if (ledgerEntryId) {
      this.basketService.getLedgerEntry(ledgerEntryId)
        .subscribe(() => {
          console.log('initialised ledgerEntry');
          localStorage.removeItem('redisNotRunning');
        }, error => {
          console.log('there is an error: ',error);
        });
    }
  }
}
