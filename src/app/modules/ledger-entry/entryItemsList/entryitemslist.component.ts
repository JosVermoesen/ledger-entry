import { Component, OnInit } from '@angular/core';
import { ILedgerEntryItem } from '../models/ledgerEntryItem';
import { LedgerEntryService } from '../services/ledgerentry.service';
import { Observable } from 'rxjs';
import { IBasket, Basket } from 'src/app/modules/ledger-entry/models/basket';
import { BasketService } from '../services/basket.service';

@Component({
  selector: 'app-entryitemslist',
  templateUrl: './entryitemslist.component.html',
  styleUrls: ['./entryitemslist.component.scss']
})
export class EntryItemsListComponent implements OnInit {
  ledgerItems: ILedgerEntryItem[];
  selectedLedgerItem: ILedgerEntryItem;

  loaded = false;
  basket$: Observable<IBasket>;

  constructor(
    private basketService: BasketService,
    private ledgerEntryService: LedgerEntryService) { }

  ngOnInit() {
    this.basket$ = this.basketService.basket$;

    this.ledgerEntryService.stateClear.subscribe(clear => {
      if (clear) {
        this.selectedLedgerItem = {
          id: '',
          description: '',
          date: '',
          dcOption: '',
          amount: 0,
          bNumber: '',
          tNumber: ''
        };
      }
    });

    this.ledgerEntryService.getLedgerEntryItems().subscribe(
      (result: ILedgerEntryItem[]) => {
        this.ledgerItems = result;
        this.loaded = true;
      }
    );
  }

  onSelect(item: ILedgerEntryItem) {
    console.log(item);

    /* this.ledgerEntryService.setFormLedgerEntry(item);
    this.selectedLedgerItem = item; */
  }

  onDelete(item: ILedgerEntryItem) {
    console.log(item);
    if (confirm('Are you sure?')) {
      this.ledgerEntryService.deleteLedgerEntryItem(item);
    }
  }

  getColor(option: string) {
    switch (option.substring(0, 1)) {
      case 'D':
        return 'blue'; // debit

      case 'C':
        return 'red'; // credit

      case 'T':
        return 'green'; // with t bookingnumber
    }
  }
}
