import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ManageContactsService {
  userRef: AngularFirestoreDocument;
  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService
  ) {}

  findContact(contact) {
    this.userRef = this.angularFirestore.collection('users').doc(`${contact}`);
    this.userRef.get().subscribe((doc) => {
      if (doc.exists) {
        console.log('User data:', doc.data());
        return this.updateContactList(contact);
      } else {
        // doc.data() will be undefined in this case
        console.log('No such user!');
      }
    });
  }

  async updateContactList(contact) {
    const loggedInUser = await this.authService.getUser();
    const userRef: AngularFirestoreDocument<string> = this.angularFirestore.doc(
      `users/${loggedInUser.email}`
    );
    const data = {
      email: contact,
    };
    const contactsCollection = userRef.collection<any>('contacts');
    return contactsCollection.add(data);
  }
}
