import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignalLocalStorageDbService {

  db = self.indexedDB;

  constructor() {
  }

  storePreKeyBundle(_store: {}) {
    const request = this.db.open('signalLocalStorageDb');
    const store = request.transaction.objectStore('preKeyBundle');
    store.add(store);
    request.addEventListener('error', (event) => {
      console.log('Request error:', request.error);
    });
  }

}
