export interface User {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  signalKeys: {
    identityPubKey: string;
    preKey: {
      publicKey: string;
      keyId: number;
    };
    registrationId: number;
    signedPreKey: {
      keyId: number;
      publicKey: string;
      signature: string;
    };
  };
}
