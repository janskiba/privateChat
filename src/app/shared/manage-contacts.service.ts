import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ManageContactsService {
  contactsRef: AngularFirestoreCollection<any> = null;

  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private angularFireAuth: AngularFireAuth
  ) {
    authService.user$.subscribe((user) => {
      if (user) {
        this.contactsRef = angularFirestore
          .collection('users')
          .doc(`${user.email}`)
          .collection('contacts');
      } else {
        console.log('user not signed in');
      }
    });
  }

  findContact(contact) {
    //check if in users collection exist wanted contact
    this.angularFirestore
      .collection('users')
      .doc(`${contact}`)
      .get()
      .subscribe((doc) => {
        if (doc.exists) {
          console.log('User data:', doc.data());
          return this.updateContactList(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log('No such user!');
        }
      });
  }

  updateContactList(contact) {
    const data = {
      displayName: contact.displayName,
      email: contact.email,
    };

    return this.contactsRef.add(data);
  }

  getContacts() {
    return this.authService.user$.pipe(
      switchMap((user) => {
        return this.angularFirestore
          .collection('users')
          .doc(`${user.email}`)
          .collection('contacts')
          .snapshotChanges()
          .pipe(
            map((actions) => {
              return actions.map((a) => {
                const data: Object = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })
          );
      })
    );
  }
}
