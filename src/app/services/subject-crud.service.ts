import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class Subject {
  _id: number;
  name: string;
  teachersName: string;
  code: string;
  days: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SubjectCrudService {
  Subjects: any = [];
  endpoint = 'http://localhost:3000/subjects';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
  constructor(private httpClient: HttpClient) { }

  createSubject(subject: Subject): Observable<any>{
    return this.httpClient.post<Subject>(this.endpoint, JSON.stringify(subject), this.httpOptions)
    .pipe(
      catchError(this.handleError<Subject>('Error occured'))
    );
  }

  getSubject(id): Observable<Subject[]> {
    return this.httpClient.get<Subject[]>(this.endpoint + '/' + id)
      .pipe(
        tap(_ => console.log(`Subject fetched: ${id}`)),
        catchError(this.handleError<Subject[]>(`Get subject id=${id}`))
      );
  }

  getSubjects(): Observable<Subject[]> {
    return this.httpClient.get<Subject[]>(this.endpoint)
      .pipe(
        tap(() => console.log('Subjects retrieved!')),
        catchError(this.handleError<Subject[]>('Get subject', []))
      );
  }

  updateSubject(id, subject: Subject): Observable<any> {
    return this.httpClient.put(this.endpoint + '/' + id, JSON.stringify(subject), this.httpOptions)
      .pipe(
        tap(_ => console.log(`Subject updated: ${id}`)),
        catchError(this.handleError<Subject[]>('Update subject'))
      );
  }

  deleteSubject(id): Observable<Subject[]> {
    return this.httpClient.delete<Subject[]>(this.endpoint + '/' + id, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Subject deleted: ${id}`)),
        catchError(this.handleError<Subject[]>('Delete subject'))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }  

}

