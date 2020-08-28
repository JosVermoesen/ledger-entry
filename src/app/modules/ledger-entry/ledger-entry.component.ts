import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ILedgerEntryItem } from './models/ledgerEntryItem';
import { LedgerEntryService } from './services/ledgerentry.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BasketService } from './services/basket.service';
import { Guid } from '../../shared/functions/uuid';

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

  constructor(
    private basketService: BasketService,
    private ledgerEntryService: LedgerEntryService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    /* this.bsConfig = {
      containerClass: 'theme-blue',
      dateInputFormat: 'DD-MM-YYYY'
    }; */

    // First grab description and date if there is a session available
    if (localStorage.getItem('ledgerEntries') === null) {
      this.tabHeading = 'New Daybook Entry';
      this.descriptionAsHeader = null;
      this.dateAsHeader = null;
      this.entryHeaderLocked = false;
    } else {
      this.entryItemsJson = JSON.parse(localStorage.getItem('ledgerEntries'));
      if (this.entryItemsJson.length === 0) {
        this.tabHeading = 'New Daybook Entry';
        localStorage.removeItem('ledgerEntries');
        this.descriptionAsHeader = null;
        this.dateAsHeader = null;
        this.entryHeaderLocked = false;
      } else {
        this.descriptionAsHeader = this.entryItemsJson[0].description;
        this.tabHeading = this.entryItemsJson[0].description;
        this.dateAsHeader = this.entryItemsJson[0].date;
        this.entryHeaderLocked = true;
        this.tabHeading = this.descriptionAsHeader;
        if (this.tabHeading.length > 13) {
          this.tabHeading = this.tabHeading.substring(0, 13) + '...';
        }
      }
    }
    this.ledgerEntryHeaderForm = this.fb.group({
      description: [this.descriptionAsHeader, Validators.required],
      date: [this.dateAsHeader, Validators.required]
    });

    // Subscribe to the selectedLog observable
    this.ledgerEntryService.selectedLedgerEntryItem.subscribe(
      (entry: ILedgerEntryItem) => {
        if (entry.id !== null) {
          this.btnAddOrEdit = 'Edit';

          this.ledgerEntryForm = this.fb.group({
            id: [entry.id],
            description: [entry.description, Validators.required],
            date: [entry.date, Validators.required],
            dcOption: [entry.dcOption, Validators.required],
            amount: [entry.amount, [Validators.required, Validators.min(0.01)]],
            bNumber: [
              entry.bNumber,
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(7)
              ]
            ],
            tNumber: [entry.tNumber]
          });
          this.isNew = false;
        } else {
          this.btnAddOrEdit = 'Add';
          this.clearState();
        }
      }
    );
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
      const journalEntry: ILedgerEntryItem = Object.assign(
        {},
        this.ledgerEntryForm.value
      );

      console.log(journalEntry);
      this.basketService.addItemToBasket(journalEntry, this.descriptionAsHeader, this.dateAsHeader, -1);
      if (this.isNew) {
        this.ledgerEntryService.addLedgerEntryItem(journalEntry);
      } else {
        if (journalEntry.dcOption === 'T' && journalEntry.tNumber === null) {
          this.warning =
            'no contra account given when changing... No changes made!';
        } else {
          this.ledgerEntryService.updateLedgerEntryItem(journalEntry);
        }
      }
    }

    // Clear state
    this.clearState();
    // this.ngOnInit();
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
      bNumber: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(7)]
      ],
      tNumber: [null]
    });
    this.ledgerEntryService.clearState();
  }

  clearEntry() {
    if (confirm('Are you sure?')) {
      localStorage.removeItem('ledgerEntries');
      this.entryItemsJson = null;
      this.entryHeaderLocked = false;
    }
  }

  checkBalance() {
    this.entryItemsJson = JSON.parse(localStorage.getItem('ledgerEntries'));
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
    }
  }

  onBooking() {
    if (confirm('Are you sure?')) {
      // send to redis API
    }
  }
}
