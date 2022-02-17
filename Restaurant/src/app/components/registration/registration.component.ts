import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  modelForm!: FormGroup;
  isError!: boolean;
  errorMessage!: string;

  constructor(private _usersService: UsersService) {
    this._usersService.isError.subscribe(data => this.isError = data);
    this._usersService.errorMessage.subscribe(data => this.errorMessage = data);
  }

  ngOnInit(): void {
    let regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    this.modelForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9 ]*$')]),
      email: new FormControl('', [Validators.required, Validators.pattern(regexEmail)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  submit(form: FormGroupDirective){
    let values = form.value;
    this._usersService.SignUp(values['username'], values['email'], values['password']);
    this.modelForm.reset();
  }

}
