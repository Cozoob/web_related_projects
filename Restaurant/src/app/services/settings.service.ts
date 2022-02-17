import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {BehaviorSubject, map} from "rxjs";
import firebase from "firebase/compat/app";
import {Settings} from "../objects/settings";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public dbPath = '/settings';
  settingsRef: AngularFirestoreCollection<Settings>;
  session!: BehaviorSubject<Settings>;
  sessionValue!: Settings;
  persistence!: string;

  constructor(private db: AngularFirestore) {
    this.settingsRef = this.db.collection(this.dbPath);

    this.loadData().subscribe(data => {
      this.session = new BehaviorSubject<Settings>(data[0]);
      this.session.asObservable().subscribe(x => {
        this.sessionValue = x;
        this.persistence = SettingsService.getPersistenceValue(x.persistence);
        firebase.auth().setPersistence(this.persistence).catch((err) => console.log(err));
      });
    });
  }

  private loadData(){
    return this.settingsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({
            key: c.payload.doc.id,
            persistence: c.payload.doc.data().persistence
          })
        )
      )
    )
  }

  public setPersistence(option: number){
    let session = SettingsService.getPersistenceValue(option);
    firebase.auth().setPersistence(session).catch((err) => console.log(err));
    this.persistence = session;
    this.updateData({ persistence: option }).catch((err) => console.log(err));
  }

  private static getPersistenceValue(val: number){
    if(val === 0){
      return firebase.auth.Auth.Persistence.SESSION;
    } else if (val === 1){
      return firebase.auth.Auth.Persistence.LOCAL;
    } else{
      return firebase.auth.Auth.Persistence.NONE;
    }
  }

  private updateData(value: any){
    return this.settingsRef.doc(this.sessionValue.key).update(value);
  }

}
