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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //user firestore reference
  user$: Observable<any>;
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router
  ) {
    console.log('authservice works');
    //listening to the angularfire authState (currently authenticated user) and grabbing related user document with their profail information
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.angularFirestore
            .doc<any>(`users/${user.uid}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.onSignInWithGoogleGoogle(provider);
  }

  async onSignInWithGoogleGoogle(provider: firebase.auth.AuthProvider) {
    const credential = await this.angularFireAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  createAccountEmailPassword(email: string, password: string) {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.updateUserData(result.user);
        console.log('succesfully signed in' + result.user);
        this.router.navigate(['/signin']);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  signInEmailPassword(email: string, password: string) {
    return this.angularFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.updateUserData(result.user);
        console.log('succesfully logged in' + result.user);
        this.router.navigate(['/']);
      });
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    return userRef.set(data, { merge: true });
  }
}
