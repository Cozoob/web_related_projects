import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {DishesService} from "../../services/dishes.service";
import {Dish} from "../../objects/dish";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {User} from "../../objects/user";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-dish-details',
  templateUrl: './dish-details.component.html',
  styleUrls: ['./dish-details.component.css']
})
export class DishDetailsComponent implements OnInit {
  isInitialDone: boolean = false;

  currency: string = 'USD';
  modelForm!:FormGroup;
  isDollar: boolean = true;
  dishKey!: string;
  dishes!: Dish[];
  dish!: Dish;
  comments: { date: string; user_name: string; title: string; content: string }[] = [];
  currentOrderedDishes!: {key: string, dishKey: string, rating: number, orderCounter: number}[];
  dishesToShow: Map<string, [Dish, number, number]>;
  numberOfCurrentOrderedDishes!:number;
  @Output() numberOfCurrentOrderedDishesChange = new EventEmitter<number>();

  currUser: User;
  orderCounter:number = 0;
  rating:number = 0;

  constructor(private _Activatedrouter: ActivatedRoute, private _dishesService: DishesService, private datepipe: DatePipe,  private _usersService: UsersService) {
    this._dishesService.currency$.subscribe(data =>{
      this.currency = data;
    });
    this.isDollar = this.currency === 'USD';

    this._dishesService.loadDishes().subscribe(data =>{
      this.dishes = data;
      this.loadTheComponent();
      this._dishesService.dishesToShow$.subscribe(data =>{
        this.dishesToShow = data;
        if(!this.isInitialDone && data.size > 0) {
          this.initialOrderCounterAndRating();
          this.isInitialDone = true;
        }
      });
    });

    this._dishesService.getCurrentOrderedDishes().subscribe(data => {
      this.currentOrderedDishes = data;
    });

    this.modelForm = new FormGroup({
      title: new FormControl('',[Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')]),
      content: new FormControl('',[Validators.required, Validators.minLength(50), Validators.maxLength(500)]),
      date: new FormControl(false)
    });

    this._usersService.currUser$.subscribe(x => this.currUser = x);
  }

  submit(form: FormGroupDirective){
    let values = form.value;
    let date = this.datepipe.transform((new Date), 'MM/dd/yyyy h:mm:ss');
    if(!values['date']){
      date = '';
    }
    if (date != null) {
      this._dishesService.addComment(this.dish.key, this.currUser.username, values['title'], values['content'], date);
    }
    this.modelForm.reset();
  }

  ngOnInit(): void {
    this._dishesService.loadDishes().subscribe(data =>{
      this.dishes = data;
      this.initialConvertCurrency();
      this.loadTheComponent();
    });
  }

  private loadTheComponent(){
    this.dishKey = String(this._Activatedrouter.snapshot.paramMap.get("id"));
    for(let d of this.dishes){
      if(d.key === this.dishKey){
        this.dish = d;
        break;
      }
    }
    this._dishesService.loadComments(this.dish.key).subscribe(data =>{
      this.comments = data;
    });
  }

  public incrementOrderedCounter(dish: any){
    if(this.orderCounter === 0){
      for(let d of this.currentOrderedDishes){

      }
    }
    this.orderCounter++;
    dish.orderedCounter++;
    dish.amount--;
    if(this.orderCounter === 1){
      this._dishesService.addOrderedDish(dish.key);
    } else {
      this._dishesService.updateOrderedDish(this.findKeyOrderedDish(dish.key),{orderCounter: this.orderCounter});
    }
    this.updateNumberOfCurrentOrderedDishes(dish);
  }

  public decrementOrderedCounter(dish: any){
    this.orderCounter--;
    dish.orderedCounter--;
    dish.amount++;
    if(this.orderCounter === 0){
      this._dishesService.deleteOrderedDish(this.findKeyOrderedDish(dish.key), this.currUser.key);
    } else {
      this._dishesService.updateOrderedDish(this.findKeyOrderedDish(dish.key),{orderCounter: this.orderCounter});
    }
    this.updateNumberOfCurrentOrderedDishes(dish);
  }

  public updateNumberOfCurrentOrderedDishes(dish: Dish){
    this._dishesService.updateDish(dish.key, {amount: dish.amount});
    this._dishesService.updateDish(dish.key, {orderedCounter: dish.orderedCounter});
  }

  private initialConvertCurrency(){
    if(!this.isDollar){
      this.dishes.forEach((item => {
        item.price = Math.round((item.price * 1.25) * 100) / 100;
      }));
    }
  }



  private initialOrderCounterAndRating(){
    if(this.dishesToShow.has(this.dish.key)){
      // @ts-ignore
      this.orderCounter = this.dishesToShow.get(this.dish.key)[1];
      // @ts-ignore
      this.rating = this.dishesToShow.get(this.dish.key)[2];
    }
  }

  private findKeyOrderedDish(dishKey: string){
    for(let d of this.currentOrderedDishes){
      if(d.dishKey === dishKey){
        return d.key;
      }
    }
    return 'aa';
  }

}
