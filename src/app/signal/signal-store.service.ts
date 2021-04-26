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
  constactPreKeyBundle = {};

  starterMessageBytes = Uint8Array.from([
    0xce,
    0x93,
    0xce,
    0xb5,
    0xce,
    0xb9,
    0xce,
    0xac,
    0x20,
    0xcf,
    0x83,
    0xce,
    0xbf,
    0xcf,
    0x85,
  ]);

  constructor(
    private angularfirestore: AngularFirestore,
    private storeService: StoreService
  ) {}

  sendMessage(to: string, from: string, message: MessageType) {
    /* const msg = { to, from, message, delivered: false, id: getNewMessageID() }; */
    console.log(message);
  }

  async createId() {
    //generate registrationId and IdentityKeyPair
    const registrationId = KeyHelper.generateRegistrationId();
    this.loggedInUserStore.put(`registrationID`, registrationId);

    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    this.loggedInUserStore.put('identityKey', identityKeyPair);

    //generate a one-time use prekey and a signed pre-key, storing both locally
    const baseKeyId = Math.floor(10000 * Math.random()); //beetwen 1 and 10000
    const preKey = await KeyHelper.generatePreKey(baseKeyId);
    this.loggedInUserStore.storePreKey(`${baseKeyId}`, preKey.keyPair);

    const signedPreKeyId = Math.floor(10000 * Math.random());
    const signedPreKey = await KeyHelper.generateSignedPreKey(
      identityKeyPair,
      signedPreKeyId
    );
    this.loggedInUserStore.storeSignedPreKey(
      signedPreKeyId,
      signedPreKey.keyPair
    );

    //store the associated public keys and signatures
    const publicSignedPreKey: SignedPublicPreKeyType = {
      keyId: signedPreKeyId,
      publicKey: signedPreKey.keyPair.pubKey, //arrayBuffer
      signature: signedPreKey.signature, //arrayBuffer
    };

    // Now we register this with the server so all users can see them
    const publicPreKey: PreKeyType = {
      keyId: preKey.keyId,
      publicKey: preKey.keyPair.pubKey, //arrayBuffer
    };

    //data to be stored on the server
    const publicData = {
      registrationId,
      identityPubKey: identityKeyPair.pubKey, //to convert
      signedPreKey: {
        keyId: publicSignedPreKey.keyId,
        publicKey: publicSignedPreKey.publicKey, //to convert
        signature: publicSignedPreKey.signature, //to convert
      },
      preKey: {
        keyId: publicPreKey.keyId,
        publicKey: publicPreKey.publicKey, //to convert
      },
    };
    this.convertToBase64(publicData);
    return publicData;
  }

  convertToBase64(data) {
    data.identityPubKey = this.arrayBufferToBase64(data.identityPubKey);
    data.signedPreKey.publicKey = this.arrayBufferToBase64(
      data.signedPreKey.publicKey
    );
    data.signedPreKey.signature = this.arrayBufferToBase64(
      data.signedPreKey.signature
    );
    data.preKey.publicKey = this.arrayBufferToBase64(data.preKey.publicKey);
  }

  //get preKeyBundle from a server and convert it to ArrayBuffer
  getPreKeyBundle(email: string) {
    this.angularfirestore
      .collection('users')
      .doc(`${email}`)
      .get()
      .subscribe(async (result) => {
        if (result.exists) {
          this.constactPreKeyBundle = await result.data()['preKeyBundle'];
          console.log(this.loggedInUserStore);

          this.constactPreKeyBundle[
            'identityPubKey'
          ] = this.base64ToArrayBuffer(
            this.constactPreKeyBundle['identityPubKey']
          );
          this.constactPreKeyBundle[
            'signedPreKey'
          ].publicKey = this.base64ToArrayBuffer(
            this.constactPreKeyBundle['signedPreKey'].publicKey
          );
          this.constactPreKeyBundle[
            'signedPreKey'
          ].signature = this.base64ToArrayBuffer(
            this.constactPreKeyBundle['signedPreKey'].signature
          );
          this.constactPreKeyBundle[
            'preKey'
          ].publicKey = this.base64ToArrayBuffer(
            this.constactPreKeyBundle['preKey'].publicKey
          );
          console.log(this.constactPreKeyBundle);
          this.startSession(email);
        } else console.log('no such documents');
      });
  }

  async startSession(email: string) {
    const recipientAddress = await new SignalProtocolAddress(`${email}`, 1);
    const sessionBuilder = new SessionBuilder(
      this.loggedInUserStore,
      recipientAddress
    );

    const preKeyBundle: DeviceType | undefined = {
      identityKey: this.constactPreKeyBundle['identityPubKey'],
      signedPreKey: this.constactPreKeyBundle['signedPreKey'],
      preKey: this.constactPreKeyBundle['preKey'],
      registrationId: this.constactPreKeyBundle['registrationId'],
    };
    console.log(JSON.stringify(preKeyBundle));
    await sessionBuilder.processPreKey(preKeyBundle!);

    const loggedInUserCipher = new SessionCipher(
      this.loggedInUserStore,
      recipientAddress
    );
    const ciphertext = await loggedInUserCipher.encrypt(
      this.starterMessageBytes.buffer
    );

    this.sendMessage('user1', 'user2', ciphertext);
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
