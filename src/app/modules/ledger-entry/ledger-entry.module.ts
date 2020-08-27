import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LedgerEntryRoutingModule } from './ledger-entry-routing.module';
import { LedgerEntryComponent } from './ledger-entry.component';


@NgModule({
  declarations: [LedgerEntryComponent],
  imports: [
    CommonModule,
    LedgerEntryRoutingModule
  ]
})
export class LedgerEntryModule { }
