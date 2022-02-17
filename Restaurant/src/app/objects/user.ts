import {IUser} from "../interfaces/user.object";


export class User implements IUser{
  key: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isManager: boolean;
  isClient: boolean;
  isBanned: boolean;
  currentOrderedDishes: any;

  constructor(key: string, username: string, email: string, password: string, isAdmin: boolean, isManager: boolean, isClient: boolean, isBanned: boolean, currentOrderedDishes: any) {
    this.key = key;
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
    this.isManager = isManager;
    this.isClient = isClient;
    this.isBanned = isBanned;
    this.currentOrderedDishes = currentOrderedDishes;
  }

}
