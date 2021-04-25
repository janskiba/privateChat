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
  KeyPairType,
} from '@privacyresearch/libsignal-protocol-typescript';
import { SignalProtocolStore } from './store';

@Injectable({
  providedIn: 'root',
})
export class SignalStoreService {
  private store = {};

  constructor() {}

  async creatId() {
    //generate registrationId and IdentityKeyPair
    const registrationId = KeyHelper.generateRegistrationId();
    this.store['registrationId'] = registrationId;

    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    this.store['identityKeyPair'] = identityKeyPair;

    //generate a one-time use prekey and a signed pre-key, storing both locally
    const baseKeyId = Math.floor(10000 * Math.random()); //beetwen 1 and 10000
    const preKey = await KeyHelper.generatePreKey(baseKeyId);
    this.storePreKey(`${baseKeyId}`, preKey.keyPair);

    const signedPreKeyId = Math.floor(10000 * Math.random());
    const signedPreKey = await KeyHelper.generateSignedPreKey(
      identityKeyPair,
      signedPreKeyId
    );
    this.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);

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
    console.log(this.store);
    return publicData;
  }

  async storePreKey(
    keyId: number | string,
    keyPair: KeyPairType
  ): Promise<void> {
    this.store['25519KeypreKey' + keyId] = keyPair;
  }

  async storeSignedPreKey(
    keyId: number | string,
    keyPair: KeyPairType
  ): Promise<void> {
    this.store['25519KeysignedKey' + keyId] = keyPair;
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

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
