import {AfterContentChecked, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { NavigationComponent } from './components/navigation/navigation.component';
import {DishesComponent} from "./components/dishes/dishes.component";
import {Router} from "@angular/router";
import {DishesService} from "./services/dishes.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NavigationComponent, DishesComponent]
})
export class AppComponent{
  title = 'Restaurant';

  constructor() {
  }

}
