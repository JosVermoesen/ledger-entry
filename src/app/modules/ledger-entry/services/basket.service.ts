import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IBasket, IBasketItem, Basket, IBasketSolde } from '../models/basket';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();

  private basketSoldeSource = new BehaviorSubject<IBasketSolde>(null);
  basketSolde$ = this.basketSoldeSource.asObservable();

  constructor(private http: HttpClient) { }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('ledgerEntry_id', basket.id);
    localStorage.setItem(basket.id, JSON.stringify(basket))
    return basket;
  }

  getLedgerEntry(id: string) {
    // LOCALSTORE !!
    return this.http
      .get('assets/dummy.txt', {
        responseType: 'text',
      })
      .pipe(
        map(() => {
          const basket: IBasket = JSON.parse(localStorage.getItem(id));
          this.basketSource.next(basket);
          // console.log(this.getCurrentBasketValue());
          this.calculateCubeAmount();
        })
      );

    // REDIS !!
    /* return this.http.get(this.baseUrl + 'ledgerentry?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          // console.log(this.getCurrentBasketValue());
          this.calculateCubeAmount();
        })
      ); */
  }

  setBasket(basket: IBasket) {
    // LOCALSTORE !!
    return this.http
      .get('assets/dummy.txt', {
        responseType: 'text',
      })
      .subscribe(() => {
        localStorage.setItem(basket.id, JSON.stringify(basket));
        this.basketSource.next(basket);
        this.calculateCubeAmount();
      });

    // REDIS !!
    /* return this.http.post(this.baseUrl + 'ledgerentry', basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
        console.log(response);
        this.calculateCubeAmount();
      }, error => {
        console.log(error);
      }); */
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(
    item: IBasketItem,
    description: string,
    entryDate: string,
    cubeControl: number) {
    const itemToAdd: IBasketItem = this.mapEntryItemToBasketItem(item);

    /* let basket = this.getCurrentBasketValue();
    if (basket === null) {
      this.createBasket();
    } */
    // above on older typescript does the same as line below!
    const basket = this.getCurrentBasketValue() ?? this.createBasket();

    basket.items = this.addOrUpdateItem(basket.items, itemToAdd);
    basket.description = description;
    basket.entryDate = entryDate;
    basket.cubeControl = cubeControl;
    this.setBasket(basket);
  }

  private calculateCubeAmount() {
    const basket = this.getCurrentBasketValue();

    let cubeAmount = 0;
    let counter = 0;
    while (counter < basket.items.length) {
      const value = basket.items[counter].amount;
      const dcOption = basket.items[counter].dcOption;
      switch (dcOption) {
        case 'D':
          cubeAmount = cubeAmount + value;
          break; // debit

        case 'C':
          cubeAmount = cubeAmount - value;
          break; // credit

        case 'T':
          break; // with t bookingnumber nothing to do
      }
      counter++;
    }
    const ctrlSolde = cubeAmount;
    this.basketSoldeSource.next({ ctrlSolde })
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
        this.calculateCubeAmount();
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    // LOCALSTORE !!
    return this.http
      .get('assets/dummy.txt', {
        responseType: 'text',
      })
      .subscribe(() => {
        this.basketSource.next(null);
        localStorage.removeItem('ledgerEntry_id');
        localStorage.removeItem(basket.id);
      });

    // REDIS !!
    /* return this.http
        .delete(this.baseUrl + 'ledgerentry?id=' + basket.id).subscribe(() => {
          this.basketSource.next(null);
          localStorage.removeItem('ledgerEntry_id');
        }, error => {
          console.log(error);
      }); */
  }
}
