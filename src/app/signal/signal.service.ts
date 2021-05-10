import { Injectable } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { Subject } from 'rxjs';
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

import { ChatsService } from '../shared/chats.service';
import { StoreService } from './store.service';
import { Message } from "../shared/models/message.model";
import { Contact } from '../shared/models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class SignalService {
  loggedInUserStore = new StoreService();
  contactStore = new StoreService();
  constactPreKeyBundle = {};

  recipientAddress: SignalProtocolAddress;

  //build a session only on first message
  firstMessage: boolean = true;

  //subject to sobscribe to a new decrypted message in contact-list component
  newMessage = new Subject<Message>();

  constructor(
    private angularfirestore: AngularFirestore,
    private chatsService: ChatsService
  ) { }

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


  //get preKeyBundle from a server and convert it to ArrayBuffer
  getPreKeyBundle(email: string, chatId: string) {
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
        } else console.log('no such documents');
      });
    this.recipientAddress = new SignalProtocolAddress(email, 1);
  }

  async startSession(email: string) {
    this.recipientAddress = new SignalProtocolAddress(email, 1);
    console.log(this.recipientAddress);
    const sessionBuilder = new SessionBuilder(
      this.loggedInUserStore,
      this.recipientAddress
    );

    //contact pre key bundle
    const preKeyBundle: DeviceType | undefined = {
      identityKey: this.constactPreKeyBundle['identityPubKey'],
      signedPreKey: this.constactPreKeyBundle['signedPreKey'],
      preKey: this.constactPreKeyBundle['preKey'],
      registrationId: this.constactPreKeyBundle['registrationId'],
    };
    console.log('contact pre key bundle: ' + preKeyBundle);
    await sessionBuilder.processPreKey(preKeyBundle!);
  }

  async encryptAndSendMessage(contact: Contact, message: string) {

    if (this.firstMessage) //first build a session
      await this.startSession(contact.email);

    //build a session only on first message
    this.firstMessage = false;

    const loggedInUserCipher = new SessionCipher(
      this.loggedInUserStore,
      this.recipientAddress
    );

    loggedInUserCipher.encrypt(
      new TextEncoder().encode(message).buffer
    ).then(
      ciphertext => {
        console.log('message: ' + message);

        console.log('encrypted message: ' + JSON.stringify(ciphertext));
        this.chatsService.sendMessage(contact.chatId, ciphertext);
      }
    );
  }

  async decryptMessage(ciphertext: Message) {
    //debugger;
    console.log('decrypting');

    const cipher = new SessionCipher(this.loggedInUserStore, this.recipientAddress);

    let plaintext: ArrayBuffer = new Uint8Array().buffer;

    if (ciphertext.content.type === 3) {
      // It is a PreKeyWhisperMessage and will establish a session.
      plaintext = await cipher.decryptPreKeyWhisperMessage(ciphertext.content.body, "binary");
    }

    else if (ciphertext.content.type === 1) {
      // It is a PreKeyWhisperMessage and will establish a session.
      plaintext = await cipher.decryptWhisperMessage(ciphertext.content.body, "binary");
    }

    const decryptedText = new TextDecoder().decode(new Uint8Array(plaintext));
    console.log(decryptedText);

    const decryptedMessage: Message = {
      content: {
        body: decryptedText,
        registratonId: ciphertext.content.registratonId,
        type: ciphertext.content.type,
      },
      createdAt: ciphertext.createdAt,
      sender: ciphertext.sender,
    };

    //this.decryptedMessages.push(decryptedMessage);
    this.newMessage.next(decryptedMessage);
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
}
