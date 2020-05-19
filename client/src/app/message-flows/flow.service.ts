import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  getFlows(): Observable<Object[]> {
    return this.http.get<Object[]>('http://localhost:1500/api/message_flow')    
  }

  getFlowsById(id): Observable<Object[]> {
    return this.http.get<Object[]>(`http://localhost:1500/api/message_flow/${id}`)
  }

  updateFlowsById(id, data): Observable<{}> {
    console.log(data);
    return this.http.post<Object[]>(`http://localhost:1500/api/message_flow/update/${id}`, data[0], this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  postFlow(data): Observable<{}> {
    console.log(data);
    return this.http.post<Object[]>(`http://localhost:1500/api/message_flow`, data[0], this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  deleteFlow(id): Observable<{}> {
    return this.http.delete(`http://localhost:1500/api/message_flow/delete/${id}`, this.httpOptions).pipe(catchError(this.handleError));
  }
}
