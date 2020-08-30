import { Guid } from '../../../shared/functions/uuid';

export interface IBasket {
  id: string;
  items: IBasketItem[];
  description: string;
  entryDate: string;
  cubeControl: number;
}

export interface IBasketItem {
  id: string;
  dcOption: string;
  amount: number;
  account: string;
  tAccount: string;
}

export class Basket implements IBasket {
  id = Guid();
  items: IBasketItem[] = [];
  description: string;
  entryDate: string;
  cubeControl: number;
}
