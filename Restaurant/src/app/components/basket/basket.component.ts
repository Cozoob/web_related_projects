import {Component, OnInit} from '@angular/core';
import {DishesService} from "../../services/dishes.service";
import {Dish} from "../../objects/dish";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  currency!: string;
  isDollar: boolean = true;
  currentOrderedDishes!: {key: string, dishKey: string, rating: number, orderCounter: number}[];
  dishes!: Dish[];
  counter = new Map<string, number>();
  costOfOrder: number = 0;
  dishesToShow!: Map<string, [Dish, number, number]>;

  dishesToShowArray: [Dish, number][] = [];

  constructor(private _dishesService: DishesService) {
    this._dishesService.currency$.subscribe(data => {
      this.currency = data;
      this.isDollar = this.currency === 'USD';
    });

    this._dishesService.loadDishes().subscribe(data =>{
      this.dishes = data;
    });

    this._dishesService.getCurrentOrderedDishes().subscribe(data =>{
      this.currentOrderedDishes = data;
    });

    this._dishesService.dishesToShow.subscribe(x => {
      this.dishesToShow = x;
      this.dishesToShowArray = [];
      for(let arr of x.values()){
        this.dishesToShowArray.push([arr[0], arr[1]]);
      }
      this.counter.clear();
      for(let d of this.dishesToShowArray){
        this.counter.set(d[0].key, d[1]);
      }
      this.updateCostOfOrder();
    });
  }

  ngOnInit(): void {
    this._dishesService.loadDishes().subscribe(data =>{
      this.dishes = data;
    });
  }

  private updateCostOfOrder(){
    this.costOfOrder = 0;
    for(let d of this.dishesToShowArray){
      // @ts-ignore
      this.costOfOrder += d[0].price * (this.counter.get(d[0].key));
    }
  }
}
