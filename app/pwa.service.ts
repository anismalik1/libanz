import {ApplicationRef ,Injectable} from '@angular/core';
import {SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs/Observable';
import { catchError,mapTo ,switchMap,first,timeout,map} from 'rxjs/operators';
import { timer ,from,of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PwaService {

  constructor(
      private appRef: ApplicationRef,
      private swUpdate: SwUpdate,
  ) {
      if (this.swUpdate.isEnabled) {
          this.appRef.isStable.pipe(
              first(isStable => isStable === true),
              switchMap(() => this.swUpdate.available),
          ).subscribe(() => {
              this.swUpdate.activateUpdate().then(() => document.location.reload());
          });
      }
  }

  checkForUpdate(): Observable<boolean> {
      const waitFor = 3000;

      if (this.swUpdate.isEnabled) {
          const available$ = this.swUpdate.available.pipe(
              mapTo(true),
              timeout(waitFor),
              catchError(() => of(false)),
          );
      }

      return timer(waitFor).pipe(mapTo(false));
  }
}