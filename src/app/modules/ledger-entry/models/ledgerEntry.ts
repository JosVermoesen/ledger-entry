import { ILedgerEntryItem } from './ledgerEntryItem';

export interface ILedgerEntry {
  ledgerItems?: ILedgerEntryItem[];
  description: string;
  entryDate: any;
  cubeControl: number;
}
