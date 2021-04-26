import { Injectable, ɵCodegenComponentFactoryResolver } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  KeyHelper,
  SignedPublicPreKeyType,
  SignalProtocolAddress,
  SessionBuilder,
  PreKeyType,
  SessionCipher,
  MessageType,
  StorageType,
  KeyPairType,
  DeviceType,
} from '@privacyresearch/libsignal-protocol-typescript';
import { User } from '../shared/user.model';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class SignalStoreService {
  loggedInUserStore = new StoreService();
  contactStore = new StoreService();

  constructor(private angularfirestore: AngularFirestore) {}
}
