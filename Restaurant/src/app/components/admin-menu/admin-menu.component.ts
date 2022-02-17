import { Component, OnInit } from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {UsersService} from "../../services/users.service";
import {Router} from "@angular/router";
import {User} from "../../objects/user";
import {Dish} from "../../objects/dish";
import {DishesService} from "../../services/dishes.service";

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
  user: User | null = null;
  dishes: Array<Dish> = [];
  page:number=1;
  pageSize:number = 3;

  constructor(private _usersService: UsersService,  private router: Router, private _dishesService: DishesService) {
    this._usersService.currUser$.subscribe(x => {
      this.user = x;
      if(!this.checkPermission()){
        this.router.navigate(['home']);
        console.log("Access denied");
      }
    });

    this._dishesService.loadDishes().subscribe(data =>{
      this.dishes = data;
    });
  }

  ngOnInit(): void {
  }

  private checkPermission():boolean{
    if(this.user){
      return this.user.isAdmin || this.user.isManager;
    }
    return false;
  }

  public deleteDish(dish: Dish){
    this._dishesService.deleteDish(dish).catch(err => console.log(err));
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

}
