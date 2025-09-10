import { inject, signal, WritableSignal } from '@angular/core';
import { DocumentData, onSnapshot } from 'firebase/firestore';
import { TransactionType } from '../services/transaction-type/transaction-type.service';
import { TRANSACTION_TYPE_COLLECTION } from '../tokens/firestore.token';

export function provideTransactionTypeMap(): WritableSignal<
  Record<string, Partial<TransactionType>>
> {
  const col = inject(TRANSACTION_TYPE_COLLECTION);
  const mapSignal = signal<Record<string, Partial<TransactionType>>>({});
  console.log('Setting up onSnapshot listener for TransactionTypeMap');
  onSnapshot(col, (snapshot) => {
    console.log('TransactionTypeMap snapshot received', snapshot);
    const map: Record<string, Partial<TransactionType>> = {};
    snapshot.forEach((doc) => {
      map[doc.id] = { id: doc.id, ...(doc.data() as DocumentData) };
    });
    mapSignal.set(map);
  });
  console.log('TransactionTypeMap initialized', mapSignal());

  return mapSignal;
}
