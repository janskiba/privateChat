import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  SignedPublicPreKeyType,
  DeviceType,
  PreKeyType,
} from '@privacyresearch/libsignal-protocol-typescript';

export interface PublicDirectoryEntry {
  identityPubKey: ArrayBuffer;
  signedPreKey: SignedPublicPreKeyType;
  oneTimePreKey?: ArrayBuffer;
}

interface FullDirectoryEntry {
  registrationId: number;
  identityPubKey: ArrayBuffer;
  signedPreKey: SignedPublicPreKeyType;
  oneTimePreKeys: PreKeyType[];
}

@Injectable({
  providedIn: 'root',
})
export class SignalDirectoryService {
  constructor(private angularfirestore: AngularFirestore) { }
  private _data: { [address: string]: FullDirectoryEntry; } = {};

  storeKeyBundle(address: string, bundle: FullDirectoryEntry): void {
    this._data[address] = bundle;
  }

  addOneTimePreKeys(address: string, keys: PreKeyType[]): void {
    this._data[address].oneTimePreKeys.unshift(...keys);
  }

  getPreKeyBundle(address: string): DeviceType | undefined {
    console.log(address);
    const bundle = this._data[address];
    console.log(bundle);
    if (!bundle) {
      return undefined;
    }
    const oneTimePreKey = bundle.oneTimePreKeys.pop();
    console.log(oneTimePreKey);

    const { identityPubKey, signedPreKey, registrationId } = bundle;
    return {
      identityKey: identityPubKey,
      signedPreKey,
      preKey: oneTimePreKey,
      registrationId,
    };
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
