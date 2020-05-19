import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Cashback } from './cashback';

@Injectable({
  providedIn: 'root'
})
export class CashbackService {

  constructor(private http: HttpClient) { }


  //Retrieve by outlet_id
  getCashback(outlet_id): Observable<Cashback[]>
  {
   return this.http.get<Cashback[]>(`http://localhost:1500/api/data/outlet/${outlet_id}`)
  }

  getCashbackAmt(psid) {
    return this.http.get(`http://localhost:1500/api/data/cashback/${psid}`)
  }

}
