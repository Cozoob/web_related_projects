export interface IUser{
  key: string,
  username: string,
  email: string,
  password: string;
  isAdmin: boolean,
  isManager: boolean,
  isClient: boolean,
  isBanned: boolean,
  currentOrderedDishes: any
}
