import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {UsersService} from "../../services/users.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit {
  modelForm!: FormGroup;
  isError!: boolean;
  errorMessage!: string;


  constructor(private _usersService: UsersService, private router: Router) {
    this._usersService.isError.subscribe(data => {
      this.isError = data;
    });
    this._usersService.errorMessage.subscribe(data => this.errorMessage = data);
  }

  ngOnInit(): void {
    let regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    this.modelForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(regexEmail)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit(form: FormGroupDirective){
    this.isError = false;
    let values = form.value;
    this._usersService.logIn(values['email'], values['password']);
    this.modelForm.reset();
  }

}
