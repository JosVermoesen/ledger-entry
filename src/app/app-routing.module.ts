import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    // path: 'ledger-entry',
    path: '**',
    loadChildren: () => import('./modules/ledger-entry/ledger-entry.module').then(m => m.LedgerEntryModule)
  },
  // { path: '**', redirectTo: 'ledger-entry', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
