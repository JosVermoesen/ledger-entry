export interface ILedgerEntryItem {
  id: string;
  dcOption: string; //
  amount: number;
  bNumber: string; // booking number
  tNumber?: string; // t booking number
  description?: string;
  date?: any;
}
