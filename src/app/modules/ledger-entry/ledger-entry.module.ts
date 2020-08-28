import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { LedgerEntryService } from './services/ledgerentry.service';
import { BasketService } from './services/basket.service';
import { EntryItemsListComponent } from './entryItemsList/entryitemslist.component';
import { LedgerEntryRoutingModule } from './ledger-entry-routing.module';
import { LedgerEntryComponent } from './ledger-entry.component';

@NgModule({
  declarations: [
    LedgerEntryComponent,
    EntryItemsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    LedgerEntryRoutingModule
  ],
  providers: [
    LedgerEntryService
  ]
})
export class LedgerEntryModule { }
