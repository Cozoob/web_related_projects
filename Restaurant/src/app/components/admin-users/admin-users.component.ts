import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {Router} from "@angular/router";
import {User} from "../../objects/user";

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  user: User | null = null;
  usersArray: User[];

  constructor(private _usersService: UsersService,  private router: Router) {
    this._usersService.currUser$.subscribe(x => {
      this.user = x;
      if(!this.checkPermission()){
        this.router.navigate(['home']);
        console.log("Access denied");
      }
    });

    this._usersService.users.subscribe(x => {
      this.usersArray = x;
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

  public changeIsBanned(user: User){
    this._usersService.updateUser(user.key, {isBanned: !user.isBanned});
  }

  public changeIsAdmin(user: User){
    this._usersService.updateUser(user.key, {isAdmin: !user.isAdmin});
  }

  public changeIsManager(user: User){
    this._usersService.updateUser(user.key, {isManager: !user.isManager});
  }

  public changeIsClient(user: User){
    this._usersService.updateUser(user.key, {isClient: !user.isClient});
  }

}
