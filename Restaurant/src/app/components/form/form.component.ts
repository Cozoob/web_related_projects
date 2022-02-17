import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validator, Validators} from '@angular/forms';
import {DishesService} from "../../services/dishes.service";
import {Router} from "@angular/router";
import {User} from "../../objects/user";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  modelForm!: FormGroup;
  user: User | null = null;

  constructor(private _dishesService: DishesService, private router: Router, private _usersService: UsersService) {
    this._usersService.currUser$.subscribe(x => {
      this.user = x;
      if(!this.checkPermission()){
        this.router.navigate(['home']);
      }
    });
  }

  ngOnInit() : void {
    this.modelForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')] ),
      cuisine: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')] ),
      type: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')] ),
      category: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')] ),
      ingredients: new FormControl('', [Validators.maxLength(50)]),
      amount: new FormControl('', [Validators.required, Validators.min(1),Validators.pattern('^[0-9]*$')] ),
      price: new FormControl('', [Validators.required, Validators.min(0),Validators.pattern('^\\d+([.]\\d{1,2})?$')] ),
      description: new FormControl('', [Validators.maxLength(100)] ),
      photoURL: new FormControl('', [Validators.maxLength(100), Validators.pattern('^(http|https)\\:\\/\\/.{3,}$')])
    });
  }

  submit(form: FormGroupDirective){
    let values = form.value;


    this._dishesService.addDish(values['name'], values['cuisine'], values['type'],
      values['category'], [values['ingredients']], values['amount'],
      values['price'], values['description'], values['photoURL']
      );

    this.modelForm.reset();
  }

  private checkPermission():boolean{
    if(this.user){
      return this.user.isAdmin || this.user.isManager;
    }
    return false;
  }

}
