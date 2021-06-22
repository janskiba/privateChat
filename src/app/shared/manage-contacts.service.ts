import { Injectable, EventEmitter } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import { ChatsService } from './chats.service';
import { Contact } from './models/contact.model';
import { LocalMessagesService } from './local-messages.service';
@Injectable({
  providedIn: 'root',
})
export class ManageContactsService {
  clickedContact$: Observable<Contact>;
  resetLocalArray = new Subject;


  //inform about a need to change ngClass on small devices
  activatedEmitter = new EventEmitter<boolean>();

  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private chatsService: ChatsService,
    private localMessagesService: LocalMessagesService
  ) { }

  findContact(contact: string) {
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
          alert('No such user!');
        }
      });
  }

  async updateContactList(contact: any) {
    const currentUser = await this.authService.getUser();
    console.log(currentUser);

    const contactsRef = this.angularFirestore
      .collection('users')
      .doc(`${currentUser.email}`)
      .collection('contacts');

    const data = {
      displayName: contact.displayName,
      email: contact.email,
    };

    console.log(data);

    const ref = await contactsRef.add(data);

    //update contact document with a field with its id
    ref.update({ chatId: ref.id });

    //create new Item in local storage
    this.localMessagesService.createNewObject(contact.email);

    return this.chatsService.createChat(contact.email, ref.id, currentUser);
  }

  getContacts() {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (user) {
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
        }
      })
    );
  }

  displayClickedContact(contact: Contact) {
    console.log(contact);
    this.resetLocalArray.next([]);
    this.localMessagesService.loadLocalMessages(contact.email);
    //convert object into observable
    this.chatsService.getMessagess(contact);

    const obs = of(contact);
    return (this.clickedContact$ = obs);
  }
}
