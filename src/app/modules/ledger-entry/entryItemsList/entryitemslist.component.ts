import { Component, OnInit } from '@angular/core';
import { ILedgerEntryItem } from '../models/ledgerEntryItem';
import { LedgerEntryService } from '../services/ledgerentry.service';

@Component({
  selector: 'app-entryitemslist',
  templateUrl: './entryitemslist.component.html',
  styleUrls: ['./entryitemslist.component.scss']
})
export class EntryItemsListComponent implements OnInit {
  ledgerItems: ILedgerEntryItem[];
  selectedLedgerItem: ILedgerEntryItem;

  loaded = false;

  constructor(private ledgerEntryService: LedgerEntryService) { }

  ngOnInit() {
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
    this.ledgerEntryService.setFormLedgerEntry(item);
    this.selectedLedgerItem = item;
  }

  onDelete(item: ILedgerEntryItem) {
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
