import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private angularFirestore: AngularFirestore,
  ) { }

  //get chatId as the parameter and change sessionState to true
  startSession(chatId: string) {
    const ref = this.angularFirestore.collection('chats').doc(chatId);
    return ref.update({ sessionState: true });
  }

  //get chatId as the parameter and change sessionState to false
  stopSession(chatId: string) {
    const ref = this.angularFirestore.collection('chats').doc(chatId);
    return ref.update({ sessionState: false });
  }
}
