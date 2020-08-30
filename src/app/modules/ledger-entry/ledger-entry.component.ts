import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import * as moment from 'moment';

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
  ledgerEntryHeaderForm: FormGroup;
  entryHeaderLocked: boolean;
  descriptionAsHeader: string;
  dateAsHeader: string;

  ledgerEntryForm: FormGroup;

  btnAddOrEdit: string;
  readyForBooking = false;
  totalSolde: number;

  loaded = false;
  basket$: Observable<IBasket>;
  basketJson: IBasket;
  selectedBasketItem: IBasketItem;

  constructor(
    private basketService: BasketService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.refreshBasket();

    const ledgerEntryId = localStorage.getItem('ledgerEntry_id');
    if (ledgerEntryId) {
      this.descriptionAsHeader = this.basketJson.description;
      this.dateAsHeader = moment(this.basketJson.entryDate).format('DD/MM/YYYY');
      this.entryHeaderLocked = true;
    } else {
      this.descriptionAsHeader = null;
      this.dateAsHeader = moment().format('DD/MM/YYYY');
      this.entryHeaderLocked = false;
    }

    this.ledgerEntryHeaderForm = this.fb.group({
      description: [this.descriptionAsHeader, Validators.required],
      lDate: [this.dateAsHeader, Validators.required]
    });

    this.btnAddOrEdit = 'Add';
    this.clearState();
  }

  refreshBasket() {
    this.basket$ = this.basketService.basket$;
    this.basketJson = this.basketService.getCurrentBasketValue();
    this.loaded = true;
  }

  onSubmit() {
    if (this.ledgerEntryForm.valid) {
      const basketItem: IBasketItem = Object.assign(
        {},
        this.ledgerEntryForm.value
      );
      this.loaded = false;
      const entryDescription = this.ledgerEntryHeaderForm.value.description;
      const entryDate = this.ledgerEntryHeaderForm.value.lDate;
      this.basketService.addItemToBasket(basketItem, entryDescription, entryDate, -1);
      this.refreshBasket();
    }
    this.clearState();
  }

  clearState() {
    this.readyForBooking = false;

    this.ledgerEntryForm = this.fb.group({
      id: Guid(),
      dcOption: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      account: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(7)]
      ],
      tAccount: [null]
    });
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
    // console.log(item);
    this.setForUpdate(item);
  }

  setForUpdate(item: IBasketItem) {
    this.readyForBooking = false;

    this.ledgerEntryForm = this.fb.group({
      id: item.id,
      dcOption: [item.dcOption, Validators.required],
      amount: [item.amount, [Validators.required, Validators.min(0.01)]],
      account: [
        item.account,
        [Validators.required, Validators.minLength(3), Validators.maxLength(7)]
      ],
      tAccount: [item.tAccount]
    });
    this.btnAddOrEdit = 'Save';
  }

  onDelete(item: IBasketItem) {
    // console.log(item);
    if (confirm('Are you sure?')) {
      this.loaded = false;
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

  clearEntry() { }
}
