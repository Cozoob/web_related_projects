import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../services/users.service";
import {SettingsService} from "../../services/settings.service";
import {User} from "../../objects/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.css']
})
export class AdminToolsComponent implements OnInit {
  user: User | null = null;
  isAdmin: boolean = false;

  constructor(private _settingsService: SettingsService, private _usersService: UsersService,  private router: Router) {
    this._usersService.currUser$.subscribe(x => {
      this.user = x;
      if(!this.checkPermission()){
        this.router.navigate(['home']);
        console.log("Access denied")
      } else {
        this.isAdmin = this.user?.isAdmin === true;
      }
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

  public choosePersistence(x: number){
    this._settingsService.setPersistence(x);
  }



}
