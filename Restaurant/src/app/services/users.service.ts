import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";
import {BehaviorSubject, map, Observable} from "rxjs";

import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User} from "../objects/user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public dbPath = '/users';
  usersRef: AngularFirestoreCollection<User>;

  isError = new BehaviorSubject(true);
  errorMessage = new BehaviorSubject('');
  currUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currUser$ = this.currUser.asObservable();

  users: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.users.asObservable();
  usersArray: User[] = [];

  constructor(public afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    this.usersRef = this.db.collection(this.dbPath);

    this.loadUsers().subscribe(data =>{
      this.users.next(data);
      this.users$.subscribe(x => this.usersArray = x);

      afAuth.authState.subscribe(x => {
        if(x) {
          this.currUser.next(this.getUser(x.uid));
        }
      });

    });
  }

  public logIn(email: string, password: string){
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then((u) => {
        console.log("Logged in!");
        if(u.user) {
          this.currUser.next(this.getUser(u.user.uid));
        }
        this.router.navigate(['home']);
      })
      .catch((err) => {
        console.log(err.message);
        this.errorMessage.next(UsersService.prepareErrorMessage(err.message));
        this.isError.next(true);
      });
  }

  public logOut(){
    this.afAuth.signOut()
      .then(() => console.log("Logged out!"))
      .catch((err) => {console.log(err)});
    this.currUser.next(null);
    this.isError.next(false);
  }

  public SignUp(username: string, email: string, password: string){
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if(user){
          let fuser = firebase.auth().currentUser
          fuser?.updateProfile({
            displayName: username
          })

          if(fuser) {
            this.addUser(fuser.uid, username, email, password);
            this.router.navigate(['']);
          }
        }

      }).catch((err) => {
        console.log(err);
        this.isError.next(true);
        this.errorMessage.next(UsersService.prepareErrorMessage(err.message));
      });
  }

  public isLoggedIn(){
    return this.afAuth.authState.pipe(map(state =>{
      return state !== null;
    }))
  }

  private static prepareErrorMessage(errorMessage: string): string{
    let message = errorMessage.slice(10);
    let reg = new RegExp(/.*(?=\(.*\)\.$)/);
    let answer = message.match(reg);
    if(answer === null){
      return ''
    }
    return answer[0];
  }

  public addUser(key:string, username: string, email:string, password: string){
    this.db.collection('/users').doc(key).set({email: email, isAdmin: false, isBanned: false, isClient: true, isManager: false, password: password, username:username});
  }

  private loadUsers(){
    return this.usersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({
            key: c.payload.doc.id,
            username: c.payload.doc.data().username,
            email: c.payload.doc.data().email,
            password: c.payload.doc.data().password,
            isAdmin: c.payload.doc.data().isAdmin,
            isManager: c.payload.doc.data().isManager,
            isClient: c.payload.doc.data().isClient,
            isBanned: c.payload.doc.data().isBanned,
            currentOrderedDishes: this.usersRef.doc(c.payload.doc.id).collection("currentOrderedDishes").get(),
          })
        ))
    );
  }

  public updateUser(key: string, value: any){
    return this.usersRef.doc(key).update(value);
  }

  private getUser(key: string){
    for(let u of this.usersArray){
      if(u.key === key){
        return u;
      }
    }
    return null;
  }



}
