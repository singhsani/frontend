import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Generic Implementaion Of CanDeactivateGuard having Type T form all Components.
 * 
 * All Component Should be implement that method {'canDeactivate'}.
 */
export interface T {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<T> {
  canDeactivate(component: T) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
