import {
  DocumentData,
  DocumentReference,
  onSnapshot,
} from 'firebase/firestore';
import {
  Observable,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

// 🔹 Cache to avoid multiple subscriptions for same doc
const docCache = new Map<string, Observable<any>>();

function docRefObs<T = DocumentData>(
  ref: DocumentReference<T>
): Observable<T | null> {
  const path = ref.path;

  if (!docCache.has(path)) {
    const obs$ = new Observable<T | null>((sub) => {
      const unsub = onSnapshot(ref, (snap) => {
        sub.next(snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null);
      });
      return () => unsub();
    }).pipe(
      shareReplay({ bufferSize: 1, refCount: true }) // 🔥 cache last value, auto-dispose when unused
    );

    docCache.set(path, obs$);
  }

  return docCache.get(path)!;
}

// 🔹 Recursively resolve DocumentReference fields in an object
function resolveObjectRefs<T extends Record<string, any>>(
  obj: T
): Observable<any> {
  const refEntries = Object.entries(obj).filter(
    ([, v]) => v && typeof v === 'object' && 'path' in (v as any)
  ) as [string, DocumentReference][];

  if (!refEntries.length) return of(obj);

  const resolved$ = combineLatest(
    refEntries.map(([key, ref]) =>
      docRefObs(ref).pipe(
        switchMap((resolved) =>
          resolved ? resolveObjectRefs(resolved) : of(null)
        ),
        map((resolved) => ({ key, resolved }))
      )
    )
  ).pipe(
    map((refResults) => {
      const merged: any = { ...obj };
      refResults.forEach(({ key, resolved }) => {
        merged[key.replace(/Ref$/, '')] = resolved; // rename e.g. categoryRef → category
      });
      return merged;
    })
  );

  return resolved$;
}

// 🔹 Works for arrays of documents
export function resolveRefs<T extends Record<string, any>>(
  source$: Observable<T[]>
): Observable<any[]> {
  return source$.pipe(
    switchMap((docs) => {
      if (!docs.length) return of([]);
      const docsWithRefs$ = docs.map((doc) => resolveObjectRefs(doc));
      return combineLatest(docsWithRefs$);
    })
  );
}
