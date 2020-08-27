import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { ILedgerEntryItem } from '../models/ledgerEntryItem';

@Injectable()
export class LedgerEntryService {
  ledgerEntryItems: ILedgerEntryItem[];

  private ledgerEntrieSource = new BehaviorSubject<ILedgerEntryItem>({
    id: null,
    dcOption: null,
    amount: 0,
    bNumber: null,
    tNumber: null,
    description: null,
    date: null,
  });

  selectedLedgerEntryItem = this.ledgerEntrieSource.asObservable();

  private stateSource = new BehaviorSubject<boolean>(true);
  stateClear = this.stateSource.asObservable();

  constructor() {
    this.ledgerEntryItems = [];
  }

  getLedgerEntryItems(): Observable<ILedgerEntryItem[]> {
    if (localStorage.getItem('ledgerEntries') === null) {
      this.ledgerEntryItems = [];
    } else {
      this.ledgerEntryItems = JSON.parse(localStorage.getItem('ledgerEntries'));
    }

    return of(
      this.ledgerEntryItems.sort((a, b) => {
        return (b.date = a.date);
      })
    );
  }

  setFormLedgerEntry(item: ILedgerEntryItem) {
    this.ledgerEntrieSource.next(item);
  }

  addLedgerEntryItem(item: ILedgerEntryItem) {
    this.ledgerEntryItems.unshift(item);

    // Add to local storage
    localStorage.setItem('ledgerEntries', JSON.stringify(this.ledgerEntryItems));
  }

  updateLedgerEntryItem(item: ILedgerEntryItem) {
    this.ledgerEntryItems.forEach((cur, index) => {
      if (item.id === cur.id) {
        this.ledgerEntryItems.splice(index, 1);
      }
    });
    this.ledgerEntryItems.unshift(item);

    // Update local storage
    localStorage.setItem('ledgerEntries', JSON.stringify(this.ledgerEntryItems));
  }

  deleteLedgerEntryItem(item: ILedgerEntryItem) {
    this.ledgerEntryItems.forEach((cur, index) => {
      if (item.id === cur.id) {
        this.ledgerEntryItems.splice(index, 1);
      }
    });

    // Delete from local storage
    localStorage.setItem('ledgerEntries', JSON.stringify(this.ledgerEntryItems));
  }

  clearState() {
    this.stateSource.next(true);
  }
}
