import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IBasket, IBasketItem, Basket } from '../models/basket';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) { }

  getLedgerEntry(id: string) {
    return this.http.get(this.baseUrl + 'ledgerentry?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          console.log(this.getCurrentBasketValue());
        })
      );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'ledgerentry', basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
        console.log(response);
      }, error => {
        console.log(error);
      });
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IBasketItem, description: string, entryDate: Date, cubeControl: number) {
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

  private mapEntryItemToBasketItem(item: IBasketItem): IBasketItem {
    return {
      id: item.id,
      dcOption: item.dcOption,
      amount: item.amount,
      account: item.account,
      tAccount: item.tAccount
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'ledgerentry?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      localStorage.removeItem('ledgerEntry_id');
    }, error => {
      console.log(error);
    });
  }
}
