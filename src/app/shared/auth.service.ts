import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';
import { SignalService } from '../signal/signal.service';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //user firestore reference
  user$: Observable<User> = null;
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router,
    private SignalService: SignalService
  ) {
    console.log('authservice works');
    //listening to the angularfire authState (currently authenticated user) and grabbing related user document with their profail information
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap((user: User) => {
        if (user) {
          return this.angularFirestore
            .doc<any>(`users/${user.email}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUser() {
    //converts user observable to a promise so we can later use it with async await
    return this.user$.pipe(first()).toPromise();
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.onSignInWithGoogleGoogle(provider);
  }

  async onSignInWithGoogleGoogle(provider: firebase.auth.AuthProvider) {
    const credential = await this.angularFireAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async googleSignOut() {
    await this.angularFireAuth.signOut();
    this.router.navigate(['/']);
  }

  async createAccountEmailPassword(
    email: string,
    password: string,
    userName: string
  ) {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result.user);
        //call updateProfile to add userName in "data" object
        this.updateProfile(result.user, userName);
        this.router.navigate(['/signin']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  signInEmailPassword(email: string, password: string) {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/user-homepage']);
      });
  }

  updateProfile(user: User, displayName: string) {
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL,
    };
    this.updateUserData(data);
  }

  private async updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${user.email}`
    );

    this.angularFirestore
      .collection('users')
      .doc(`${user.email}`)
      .get()
      .subscribe(async (doc) => {
        if (doc.exists) {
          //zakomentowane do testów, póżniej odkomentu i usuc poniższe
          /* const data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          };
          return userRef.set(data, { merge: true }); */

          const preKeyBundle = await this.SignalService.createId();
          console.log(preKeyBundle);
          const data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            preKeyBundle,
          };
          return userRef.set(data, { merge: true });
        } else {
          const preKeyBundle = await this.SignalService.createId();
          console.log(preKeyBundle);
          const data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            preKeyBundle,
          };
          return userRef.set(data, { merge: true });
        }
      });

    this.router.navigate(['/user-homepage']);
  }
}
