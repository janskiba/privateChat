import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ChatsService } from './chats.service';

@Injectable({
  providedIn: 'root',
})
export class ManageContactsService {
  contactsRef: AngularFirestoreCollection<any> = null;
  clickedContact$: Observable<any>;

  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private angularFireAuth: AngularFireAuth,
    private chatsService: ChatsService
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

  async updateContactList(contact) {
    const data = {
      displayName: contact.displayName,
      email: contact.email,
    };

    const ref = await this.contactsRef.add(data);

    //update contact document with a field with its id
    ref.update({ chatId: ref.id });

    return this.chatsService.createChat(contact.email, ref.id);
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

  displayClickedContact(contact) {
    console.log(contact);
    //convert object into observable
    const obs = of(contact);
    return (this.clickedContact$ = obs);
  }
}
