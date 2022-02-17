export interface IDish {
  key: string;
  name: string;
  cuisine: string;
  type: string;
  category: string;
  ingredients: Array<string>;
  amount: number;
  price: number;
  description: string;
  photoURL: string;
  orderedCounter: number;
  rating: number;
  amountOfRatings: number;
  comments: any;
}
