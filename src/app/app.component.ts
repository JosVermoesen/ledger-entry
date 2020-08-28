import { Component, OnInit } from '@angular/core';
import { RedisLedgerService } from './modules/ledger-entry/services/redisledger.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private redisLedgerService: RedisLedgerService) {}

  ngOnInit(): void {
    // check open sessions for redis used with the browser used
    const ledgerEntryId = localStorage.getItem('ledgerEntry_id');
    if (ledgerEntryId) {
      this.redisLedgerService.getLedgerEntry(ledgerEntryId)
        .subscribe(() => {
          console.log('initialised ledgerEntry');
        }, error => {
          console.log(error);
        });
    }
  }
}
