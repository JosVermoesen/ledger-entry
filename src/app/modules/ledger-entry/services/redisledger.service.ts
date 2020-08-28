import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IBasket, IBasketItem, Basket } from '../../../shared/models/redisLedgerEntry';
import { ILedgerEntryItem } from '../models/ledgerEntryItem';

@Injectable({
  providedIn: 'root'
})
export class RedisLedgerService {
  baseUrl = environment.apiUrl;
  private entrySource = new BehaviorSubject<IBasket>(null);
  basket$ = this.entrySource.asObservable();

  constructor(private http: HttpClient) { }

  getLedgerEntry(id: string) {
    return this.http.get(this.baseUrl + 'ledgerentry?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.entrySource.next(basket);
          console.log(this.getCurrentBasketValue());
        })
      );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'ledgerentry', basket)
      .subscribe((response: IBasket) => {
        this.entrySource.next(response);
        console.log(response);
      }, error => {
        console.log(error);
      });
  }

  getCurrentBasketValue() {
    return this.entrySource.value;
  }

  addItemToBasket(item: ILedgerEntryItem, description: string, entryDate: Date, cubeControl: number) {
    const itemToAdd: IBasketItem = this.mapEntryItemToBasketItem(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd);
    basket.description = description;
    basket.entryDate = entryDate;
    basket.cubeControl = cubeControl;
    this.setBasket(basket);
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if (index === -1) {
      items.push(itemToAdd);
    } else {
      items[index].dcOption = itemToAdd.dcOption;
      items[index].amount = itemToAdd.amount;
      items[index].account = itemToAdd.account;
      items[index].tAccount = itemToAdd.tAccount;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('ledgerEntry_id', basket.id);
    return basket;
  }

  private mapEntryItemToBasketItem(item: ILedgerEntryItem): IBasketItem {
    return {
      id: item.id,
      dcOption: item.dcOption,
      amount: item.amount,
      account: item.bNumber,
      tAccount: item.tNumber
    }
  }
}
