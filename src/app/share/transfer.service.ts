import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  public Key: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor() { }
}
