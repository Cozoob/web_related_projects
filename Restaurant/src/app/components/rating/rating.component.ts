import {Component, Input, OnInit} from '@angular/core';
import {Dish} from "../../objects/dish";
import {DishesService} from "../../services/dishes.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../objects/user";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  dishes!: Map<string, [Dish, number, number]>;
  @Input() dish!: Dish;
  stars: number[] = [1, 2, 3, 4, 5];
  value: number = 0;
  currUser: User | null = null

  constructor(private _Activatedrouter: ActivatedRoute, private _dishesService: DishesService, private _usersService: UsersService) {
    this._dishesService.dishesToShow$.subscribe(x => {
      this.dishes = x;
      this.loadTheComponent();
    });

    this._usersService.currUser$.subscribe(x => {
      this.currUser = x;

    });
  }

  ngOnInit(): void {
  }

  rate(star: number): void {
    if(this.value === 0) {
      this.dish.rating = Math.round((star + this.dish.rating * this.dish.amountOfRatings) * 10 / (this.dish.amountOfRatings + 1)) / 10;
      this.dish.amountOfRatings++;
    } else {
      this.dish.rating = Math.round((this.dish.rating * this.dish.amountOfRatings - this.value) * 10 / (this.dish.amountOfRatings - 1)) / 10;
      this.dish.rating = Math.round((this.dish.rating * (this.dish.amountOfRatings - 1) + star) * 10 / (this.dish.amountOfRatings)) / 10;
    }

    this.value = star;
    this._dishesService.updateDish(this.dish.key, {amountOfRatings: this.dish.amountOfRatings});
    this._dishesService.updateDish(this.dish.key, {rating: this.dish.rating});
    this._dishesService.updateOrderedDish(this._dishesService.findKeyOrderedDish(this.dish.key), {rating: star})
  }

  private loadTheComponent(){
    let dishKey = String(this._Activatedrouter.snapshot.paramMap.get("id"));
    let param = this.dishes.get(dishKey);
    if(param){
      this.dish = param[0];
      this.value = param[2];
    }
  }
}
