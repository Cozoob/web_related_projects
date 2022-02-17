import { IDish } from "../interfaces/dish.object";

export class Dish implements IDish{
  key:string;
  amount!: number;
  amountOfRatings!: number;
  category!: string;
  cuisine!: string;
  description!: string;
  ingredients!: Array<string>;
  name!: string;
  orderedCounter!: number;
  photoURL!: string;
  price!: number;
  rating!: number;
  type!: string;
  comments!: any;

  constructor(
  name: string,
  cuisine: string,
  type: string,
  category: string,
  ingredients: Array<string>,
  amount: number,
  price: number,
  description: string,
  photoURL: string,
  orderedCounter: number,
  rating: number,
  amountOfRatings: number,
  comments: any) {
    this.name = name;
    this.cuisine = cuisine;
    this.type = type;
    this.category = category;
    this.ingredients = ingredients;
    this.amount = amount;
    this.price = price;
    this.description =description;
    this.photoURL = photoURL;
    this.orderedCounter = orderedCounter;
    this.rating =rating;
    this.amountOfRatings = amountOfRatings;
    this.comments = comments;
  }

}
