import {
  Component,
  Input,
} from '@angular/core';
import {DishesService} from "../../services/dishes.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UsersService} from "../../services/users.service";
import {User} from "../../objects/user";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent{
  user: User | null;

  @Input()
  numberOfCurrentOrderedDishes!: number;

  constructor(private _dishesService: DishesService, private afAuth: AngularFireAuth, private _usersService: UsersService) {
    this._usersService.currUser$.subscribe(user => {
      this.user = user;
    });

    this._dishesService.numberOfCurrentOrderedDishes$.subscribe(data =>{
      this.numberOfCurrentOrderedDishes = data;
    });
  }

  ngOnInit(){
    this._usersService.currUser$.subscribe(user => this.user = user);
  }

  public logOut(){
    this._usersService.logOut();
  }

}
