import {Injectable} from '@angular/core';
import {Dish} from "../objects/dish";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Comment} from "../objects/comment";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {UsersService} from "./users.service";
import {User} from "../objects/user";
import {OrderedDish} from "../objects/ordered-dish";

@Injectable({
  providedIn: 'root'
})
export class DishesService {
  public dbPath = '/dishes';
  dishesRef: AngularFirestoreCollection<Dish>;
  private dishes: BehaviorSubject<Dish[]> =  new BehaviorSubject<Dish[]>([]);
  dishes$: Observable<Dish[]> = this.dishes.asObservable();

  currency: BehaviorSubject<string> = new BehaviorSubject<string>('USD');
  currency$: Observable<string> = this.currency.asObservable();
  isInitialConvert: boolean = true;

  numberOfCurrentOrderedDishes$: Observable<any>;
  updateCurrentOrderedDishes$: Observable<any>;
  private currentOrderedDishes: BehaviorSubject<{key: string, dishKey: string, rating: number, orderCounter: number}[]> = new BehaviorSubject<{key: string, dishKey: string, rating: number, orderCounter: number}[]>([]);
  numberOfCurrentOrderedDishes = new BehaviorSubject(0);
  currentOrderedDishes$: Observable<{key: string, dishKey: string, rating: number, orderCounter: number}[]> = this.currentOrderedDishes.asObservable();
  currentOrderedDishesArray: {key: string, dishKey: string, rating: number, orderCounter: number}[] = [];

  dishesToShow: BehaviorSubject<Map<string, [Dish, number, number]>> = new BehaviorSubject<Map<string, [Dish, number, number]>>(new Map());
  dishesToShow$: Observable<Map<string, [Dish, number, number]>> = this.dishesToShow.asObservable(); // {key: dishKey, arr: [Dish, orderedCounter, rating]}

  currUser: User;

  constructor(private db: AngularFirestore, private _usersService: UsersService) {
    this.loadDishes().subscribe(dishes =>{
          this.dishes.next(dishes);
          this._usersService.currUser$.subscribe(x => {
            this.currUser = x;
            if(x) {
              this.loadCurrentOrderedDishes(x.key).subscribe(orderedDishes => {
                this.currentOrderedDishes.next(orderedDishes);
                this.currentOrderedDishes$ = this.currentOrderedDishes.asObservable();
                this.currentOrderedDishes$.subscribe(x => this.currentOrderedDishesArray = x);
                this.updateCurrentOrderedDishesNumber(orderedDishes);

                this.dishesToShow.next(this.getDishesToShow(orderedDishes, dishes));
                this.dishesToShow$ = this.dishesToShow.asObservable();
              });
            }
          });
        });

    this.dishes$ = this.dishes.asObservable();

    this.numberOfCurrentOrderedDishes$ = this.numberOfCurrentOrderedDishes.asObservable();

    this.updateCurrentOrderedDishes$ = this.currentOrderedDishes.asObservable();
  }

  public addDish(name: string, cuisine: string, type: string,
                 category: string, ingredients: string[], amount: number,
                 price: number, description: string, photoURL: string
                 ){
    let dish = new Dish(name, cuisine, type,
      category, ingredients, amount, price,
      description, photoURL, 0, 1, 0, []);
    this.dishesRef.add({...dish});
  }

  public addOrderedDish(dishKey: string){
    let d = new OrderedDish(dishKey, 1, 0);
    return this._usersService.usersRef.doc(this.currUser.key).collection("currentOrderedDishes").add({...d});
  }

  public deleteDish(dish: Dish){
    for(let u of this._usersService.usersArray){
      this.deleteOrderedDish(this.findKeyOrderedDish(dish.key), u.key);
    }
    return this.dishesRef.doc(dish.key).delete();
  }

  public deleteOrderedDish(key: string, usersKey: string){
    return this._usersService.usersRef.doc(usersKey).collection("currentOrderedDishes").doc(key).delete();
  }

  public updateCurrentOrderedDishes(data: any){
    this.currentOrderedDishes.next(data);
    this.updateCurrentOrderedDishesNumber(data);
  }

  public updateCurrentOrderedDishesNumber(data: OrderedDish[]){
    let counter = 0;
    for(let dish of data){
      counter += dish.orderCounter;
    }
    this.numberOfCurrentOrderedDishes.next(counter);
  }

  public getCurrentOrderedDishes(): Observable<{key: string, dishKey: string, rating: number, orderCounter: number}[]>{
    return this.currentOrderedDishes$;
  }

  public loadDishes(){
    this.dishesRef = this.db.collection(this.dbPath);

    return this.dishesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({key: c.payload.doc.id,
            name: c.payload.doc.data().name,
            cuisine: c.payload.doc.data().cuisine,
            type: c.payload.doc.data().type,
            category: c.payload.doc.data().category,
            ingredients: c.payload.doc.data().ingredients,
            amount: c.payload.doc.data().amount,
            price: c.payload.doc.data().price,
            description: c.payload.doc.data().description,
            photoURL: c.payload.doc.data().photoURL,
            orderedCounter: c.payload.doc.data().orderedCounter,
            rating: c.payload.doc.data().rating,
            amountOfRatings: c.payload.doc.data().amountOfRatings,
            comments: this.dishesRef.doc(c.payload.doc.id).collection("Comments").get() })
        ))
    );
  }

  public loadComments(key: string){
    return this.dishesRef.doc(key).collection("Comments").snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({
            user_name: c.payload.doc.data()['user_name'],
            title: c.payload.doc.data()['title'],
            content: c.payload.doc.data()['content'],
            date: c.payload.doc.data()['date']
          })
        )
      )
    )
  }

  public addComment(key: string, user_name: string, title: string, content: string, date: string){
    let comment = new Comment(user_name, title, content, date);
    this.dishesRef.doc(key).collection("Comments").add({...comment});
  }

  public updateDish(key: string, value: any){
    return this.dishesRef.doc(key).update(value);
  }

  public updateOrderedDish(key: string, value: any){
    return this._usersService.usersRef.doc(this.currUser.key).collection("currentOrderedDishes").doc(key).update(value);
  }

  public changeCurrency(currency: string){
    if(currency === 'USD'){
      this.currency.next('GBP');
    } else {
      this.currency.next('USD');
    }
  }

  private loadCurrentOrderedDishes(key: string){
    return this._usersService.usersRef.doc(key).collection("currentOrderedDishes").snapshotChanges().pipe(
      map(changes =>
      changes.map(c =>
        ({
          key: c.payload.doc.id,
          dishKey: c.payload.doc.data()['dishKey'],
          rating: c.payload.doc.data()['rating'],
          orderCounter: c.payload.doc.data()['orderCounter']
        })
      )
      )
    )
  }

  private getDishesToShow(OrderedDishes: OrderedDish[], dishes: Dish[]){
    let answer: Map<string, [Dish, number, number]> = new Map();
    for(let od of OrderedDishes){
      for(let d of dishes ){
        if(od.dishKey === d.key){
          answer.set(d.key, [d, od.orderCounter, od.rating]);
        }
      }
    }
    return answer;
  }

  public findKeyOrderedDish(dishKey: string){
    for(let d of this.currentOrderedDishesArray){
      if(d.dishKey === dishKey){
        return d.key;
      }
    }
    return 'aa';
  }

}
