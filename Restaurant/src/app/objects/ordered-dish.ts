import {IOrderedDish} from "../interfaces/ordered-dish";

export class OrderedDish implements IOrderedDish{
  dishKey: string;
  orderCounter: number;
  rating: number;

  constructor(dishKey: string, orderCounter: number, rating: number) {
    this.dishKey = dishKey;
    this.orderCounter = orderCounter;
    this.rating = rating;
  }
}
