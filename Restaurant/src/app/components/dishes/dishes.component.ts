import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DishesService} from "../../services/dishes.service";
import {Dish} from "../../objects/dish";
import {OrderedDish} from "../../objects/ordered-dish";

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  currency: string = 'USD';
  isDollar: boolean = true;
  page:number=1;
  pageSize:number = 3;
  dishes: Array<Dish> = [];
  currentOrderedDishes!: OrderedDish[];
  cheapestPrice:number = Infinity;
  reachestPrice:number = -Infinity;
  numberOfCurrentOrderedDishes!:number;
  @Output() numberOfCurrentOrderedDishesChange = new EventEmitter<number>();

  constructor(private _dishesService: DishesService) {
    this._dishesService.currency$.subscribe(data => {
      this.currency = data;
    });
    this.isDollar = this.currency === 'USD';

    this._dishesService.loadDishes().subscribe(data =>{
      this.dishes = data;
      this.findCheapestReachestPrice();
    });

    this._dishesService.getCurrentOrderedDishes().subscribe(data => {
      this.currentOrderedDishes = data;
    });
  }

  ngOnInit(): void {
    this._dishesService.loadDishes().subscribe(data =>{
      this.dishes = data;
      this.findCheapestReachestPrice();
      this.initialConvertCurrency();
    });
  }

  private findCheapestReachestPrice(){
    this.cheapestPrice = Infinity;
    this.reachestPrice = -Infinity;
    for(let dish of this.dishes){
      this.reachestPrice = Math.max(this.reachestPrice, dish.price);
      this.cheapestPrice = Math.min(this.cheapestPrice, dish.price);
    }
  }

  public updateNumberOfCurrentOrderedDishes(){
    this._dishesService.updateCurrentOrderedDishes(this.currentOrderedDishes);
  }

  public decrementPageSize(){
    if(this.pageSize > 1){
      this.pageSize--;
    }
  }

  public incrementPageSize(){
    if(this.pageSize < this.dishes.length){
      this.pageSize++;
    }
  }

  public changeCurrency(){
    this._dishesService.changeCurrency(this.currency);
    this.isDollar = !this.isDollar;
    this.convertCurrency();
  }

  private convertCurrency(){
    if(this.isDollar) { // USD -> GBP : ~= x*0.8
      this.dishes.forEach((item => {
        item.price = Math.round((item.price * 0.8) * 100) / 100;
      }));

    } else if(!this.isDollar) { // GBP -> USD : ~= x*1.25
      this.dishes.forEach((item => {
        item.price = Math.round((item.price * 1.25) * 100) / 100;
      }));

    }
    this._dishesService.updateCurrentOrderedDishes(this.currentOrderedDishes);
  }

  private initialConvertCurrency(){
    if(!this.isDollar){
      this.dishes.forEach((item => {
        item.price = Math.round((item.price * 1.25) * 100) / 100;
      }));
    }
  }

  public getStringBoolean(bool: boolean){
    return String(bool);
  }

}
