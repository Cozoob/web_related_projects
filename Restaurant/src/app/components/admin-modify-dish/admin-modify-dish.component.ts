import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../objects/user";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {Dish} from "../../objects/dish";
import {DishesService} from "../../services/dishes.service";

@Component({
  selector: 'app-admin-modify-dish',
  templateUrl: './admin-modify-dish.component.html',
  styleUrls: ['./admin-modify-dish.component.css']
})
export class AdminModifyDishComponent implements OnInit {
  user: User | null = null;
  modelForm!: FormGroup;
  dishKey!: string;
  dishes!: Dish[];
  dish!: Dish;

  constructor(private _Activatedrouter: ActivatedRoute, private _dishesService: DishesService, private _usersService: UsersService,  private router: Router) {
    this._usersService.currUser$.subscribe(x => {
      this.user = x;
      if(!this.checkPermission()){
        this.router.navigate(['home']);
        console.log("Access denied");
      }
    });

    this._dishesService.loadDishes().subscribe(data =>{
      this.dishes = data;
      this.loadTheComponent();
      });
    }

  ngOnInit(): void {
    this.modelForm = new FormGroup({
      name: new FormControl('', [ Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')] ),
      cuisine: new FormControl('', [Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')] ),
      type: new FormControl('', [ Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')] ),
      category: new FormControl('', [ Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')] ),
      ingredients: new FormControl('', [Validators.maxLength(50)]),
      amount: new FormControl('', [ Validators.min(1),Validators.pattern('^[0-9]*$')] ),
      price: new FormControl('', [Validators.min(0),Validators.pattern('^\\d+([.]\\d{1,2})?$')] ),
      description: new FormControl('', [Validators.maxLength(100)] ),
      photoURL: new FormControl('', [Validators.maxLength(100), Validators.pattern('^(http|https)\\:\\/\\/.{3,}$')])
    });
  }

  private checkPermission():boolean{
    if(this.user){
      return this.user.isAdmin || this.user.isManager;
    }
    return false;
  }

  submit(form: FormGroupDirective){
    let values = form.value;

    if(values['name'] != ''){
      this._dishesService.updateDish(this.dish.key, {name: values['name']});
    }
    if(values['cuisine'] != ''){
      this._dishesService.updateDish(this.dish.key, {cuisine: values['cuisine']});
    }
    if(values['type'] != ''){
      this._dishesService.updateDish(this.dish.key, {type: values['type']});
    }
    if(values['category'] != ''){
      this._dishesService.updateDish(this.dish.key, {category: values['category']});
    }
    if(values['ingredients'] != ''){
      this._dishesService.updateDish(this.dish.key, {ingredients: [values['ingredients']]});
    }
    if(values['amount'] != ''){
      this._dishesService.updateDish(this.dish.key, {amount: Number(values['amount'])});
    }
    if(values['price'] != ''){
      this._dishesService.updateDish(this.dish.key, {price: Number(values['price'])});
    }
    if(values['description'] != ''){
      this._dishesService.updateDish(this.dish.key, {description: values['description']});
    }
    if(values['photoURL'] != ''){
      this._dishesService.updateDish(this.dish.key, {photoURL: values['photoURL']});
    }

    this.modelForm.reset();
  }

  private loadTheComponent(){
    this.dishKey = String(this._Activatedrouter.snapshot.paramMap.get("id"));
    for(let d of this.dishes){
      if(d.key === this.dishKey){
        this.dish = d;
        break;
      }
    }
  }

}
