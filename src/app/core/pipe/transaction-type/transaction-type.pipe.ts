import { inject, Pipe, PipeTransform } from '@angular/core';
import { DocumentReference } from 'firebase/firestore';
import { TransactionType } from '../../services/transaction-type/transaction-type.service';
import { TRANSACTION_TYPE_MAP } from '../../tokens/firestore.token';

@Pipe({
  standalone: true,
  name: 'transactionType',
  pure: false,
})
export class TransactionTypePipe implements PipeTransform {
  private transactionTypeMapper: Record<string, Partial<TransactionType>> =
    inject(TRANSACTION_TYPE_MAP);
  transform(value: DocumentReference): string {
    return this.transactionTypeMapper[value.path].name ?? '';
  }
}
