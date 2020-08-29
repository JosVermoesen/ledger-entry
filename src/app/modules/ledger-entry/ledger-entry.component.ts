import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ILedgerEntryItem } from './models/ledgerEntryItem';
import { LedgerEntryService } from './services/ledgerentry.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BasketService } from './services/basket.service';
import { Guid } from '../../shared/functions/uuid';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem } from './models/basket';

@Component({
  selector: 'app-ledger-entry',
  templateUrl: './ledger-entry.component.html',
  styleUrls: ['./ledger-entry.component.scss']
})
export class LedgerEntryComponent implements OnInit {
  bsConfig: Partial<BsDatepickerConfig>;
  warning: string;
  entryItemsJson: ILedgerEntryItem[];

  ledgerEntryForm: FormGroup;

  ledgerEntryHeaderForm: FormGroup;
  entryHeaderLocked: boolean;
  descriptionAsHeader: string;
  dateAsHeader: Date;

  tabHeading: string;
  btnAddOrEdit: string;
  isNew = true;
  readyForBooking = false;
  totalSolde: number;
  countEntries: number;

  loaded = false;
  basket$: Observable<IBasket>;
  basketJson: IBasket;
  selectedBasketItem: IBasketItem;

  constructor(
    private basketService: BasketService,
    private ledgerEntryService: LedgerEntryService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.refreshBasket();

    const ledgerEntryId = localStorage.getItem('ledgerEntry_id');
    if (ledgerEntryId) {
      this.descriptionAsHeader = this.basketJson.description;
      this.dateAsHeader = this.basketJson.entryDate;
      this.entryHeaderLocked = true;
    } else {
      this.descriptionAsHeader = null;
      this.dateAsHeader = null;
      this.entryHeaderLocked = false;
    }

    this.ledgerEntryHeaderForm = this.fb.group({
      description: [this.descriptionAsHeader, Validators.required],
      date: [this.dateAsHeader, Validators.required]
    });

    this.btnAddOrEdit = 'Add';
    this.clearState();
  }

  refreshBasket() {
    this.basket$ = this.basketService.basket$;
    this.basketJson = this.basketService.getCurrentBasketValue();
    this.loaded = true;
  }

  onHeaderLock() {
    this.descriptionAsHeader = this.ledgerEntryHeaderForm.value.description;
    this.dateAsHeader = this.ledgerEntryHeaderForm.value.date;
    this.tabHeading = this.descriptionAsHeader;
    if (this.tabHeading.length > 15) {
      this.tabHeading = this.tabHeading.substring(0, 15) + '...';
    }
    this.entryHeaderLocked = true;
    this.clearState();
  }

  onSubmit() {
    if (this.ledgerEntryForm.valid) {
      const basketItem: IBasketItem = Object.assign(
        {},
        this.ledgerEntryForm.value
      );

      console.log(basketItem);
      const entryDescription = this.ledgerEntryHeaderForm.value.description;
      const entryDate = this.ledgerEntryHeaderForm.value.date;
      this.basketService.addItemToBasket(basketItem, entryDescription, entryDate, -1);
      this.refreshBasket();
    }
    this.clearState();
  }

  clearState() {
    this.isNew = true;
    this.readyForBooking = false;
    this.totalSolde = null;

    this.ledgerEntryForm = this.fb.group({
      id: Guid(),
      description: [this.descriptionAsHeader, Validators.required],
      date: [this.dateAsHeader, Validators.required],
      dcOption: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      account: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(7)]
      ],
      tAccount: [null]
    });
    this.ledgerEntryService.clearState();
  }

  clearEntry() {
    if (confirm('Are you sure?')) {
      // localStorage.removeItem('ledgerEntries');
      this.entryItemsJson = null;
      this.entryHeaderLocked = false;
    }
  }

  checkBalance() {
    /* this.entryItemsJson = JSON.parse(localStorage.getItem('ledgerEntries'));
    if (this.entryItemsJson.length !== 0) {
      this.countEntries = 0;
      this.totalSolde = 0;
      while (this.countEntries < this.entryItemsJson.length) {
        const thisEntry: ILedgerEntryItem = this.entryItemsJson[this.countEntries];
        const value = thisEntry.amount;
        switch (thisEntry.dcOption.substring(0, 1)) {
          case 'D':
            this.totalSolde = this.totalSolde + value;
            break; // debit

          case 'C':
            this.totalSolde = this.totalSolde - value;
            break; // credit

          case 'T':
            break; // with t bookingnumber
        }

        this.countEntries++;
      }

      if (this.totalSolde === 0) {
        this.readyForBooking = true;
      } else {
        this.readyForBooking = false;
      }
    } */
  }

  onBooking() {
    if (confirm('Are you sure?')) {
      // send to redis API
    }
  }

  onSelect(item: IBasketItem) {
    console.log(item);
    /* this.ledgerEntryService.setFormLedgerEntry(item);
    this.selectedLedgerItem = item; */
  }

  onDelete(item: IBasketItem) {
    console.log(item);
    if (confirm('Are you sure?')) {
      this.basketService.removeItemFromBasket(item);
      this.refreshBasket();
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
