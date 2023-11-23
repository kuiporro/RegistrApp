import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class User {
  _id: number;
  rut: string;
  name: string;
  suname: string;
  username: string;
  email: string;
  password: string;
  isAdmin: string;
  teacher: string;
}

@Injectable({
  providedIn: 'root'
})


export class UserCrudService {
  Users: any = [];
  endpoint = 'http://localhost:3000/usuarios';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
  constructor(private httpClient: HttpClient) { }
//----------------------------crear usuario--------------------
  createUser(user: User): Observable<any>{
    return this.httpClient.post<User>(this.endpoint, JSON.stringify(user), this.httpOptions)
    .pipe(
      catchError(this.handleError<User>('Error occured'))
    );
  }

  validaRut(rutCompleto:any) {
    rutCompleto = rutCompleto.replace("‐","-");
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
      return false;
    var tmp 	= rutCompleto.split('-');
    var digv	= tmp[1]; 
    var rut 	= tmp[0];
    if ( digv == 'K' ) digv = 'k' ;
    
    return (this.dv(rut) == digv );
  }

  dv (T:any){
    var M=0,S=1;
    for(;T;T=Math.floor(T/10))
      S=(S+T%10*(9-M++%6))%11;
    return S?S-1:'k';
  }

  checkData(rut, name, suname, username, email, password): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!this.isValidRut(rut)) {
            reject('RUT inválido.');
        } else if (!this.isValidName(name)) {
            reject('Nombre inválido.');
        } else if (!this.isValidSurname(suname)) {
            reject('Apellido inválido.');
        } else if (!this.isValidUsername(username)) {
            reject('Nombre de usuario inválido.');
        } else if (!this.isValidEmail(email)) {
            reject('Email inválido.');
        } else if (!this.isValidPassword(password)) {
            reject('Contraseña inválida.');
        } else {
            this.getUsers().subscribe((response) => {
                this.Users = response;
                if (this.isEmailTaken(email)) {
                    reject('El email ya está en uso.');
                } else if (this.isRutTaken(rut)) {
                    reject('El RUT ya está en uso.');
                } else if (this.isUsernameTaken(username)) {
                    reject('El nombre de usuario ya está en uso.');
                } else {
                    resolve('Validación exitosa.');
                }
            });
        }
    });
}

isValidRut(rut: string): boolean {
    return rut.length === 10 && this.validaRut(rut);
}

isValidName(name: string): boolean {
    return name.length >= 3;
}

isValidSurname(suname: string): boolean {
    return suname.length >= 4;
}

isValidUsername(username: string): boolean {
    return username.length >= 5;
}

isValidEmail(email: string): boolean {
    const expression: RegExp = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
    return expression.test(email);
}

isValidPassword(password: string): boolean {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return regex.test(password);
}

isEmailTaken(email: string): boolean {
    return this.Users.some(user => user.email === email);
}

isRutTaken(rut: string): boolean {
    return this.Users.some(user => user.rut === rut);
}

isUsernameTaken(username: string): boolean {
    return this.Users.some(user => user.username === username);
}


//esta funcion nos ayuda a mostrar el registro que nostros pedimos
  getUser(id): Observable<User[]> {
    return this.httpClient.get<User[]>(this.endpoint + '/' + id)
      .pipe(
        tap(_ => console.log(`User fetched: ${id}`)),
        catchError(this.handleError<User[]>(`Get user id=${id}`))
      );
  }

//nos ayuda a listar los registros que estan en la "usuarios"
  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.endpoint)
      .pipe(
        tap(() => console.log('Users retrieved!')),
        catchError(this.handleError<User[]>('Get user', []))
      );
  }
//-----------------actualizar usuario-------------
  updateUser(id, user: User): Observable<any> {
    return this.httpClient.put(this.endpoint + '/' + id, JSON.stringify(user), this.httpOptions)
      .pipe(
        tap(_ => console.log(`User updated: ${id}`)),
        catchError(this.handleError<User[]>('Update user'))
      );
  }
//------------------eliminar usuario----------------------
  deleteUser(id): Observable<User[]> {
    return this.httpClient.delete<User[]>(this.endpoint + '/' + id, this.httpOptions)
      .pipe(
        tap(_ => console.log(`User deleted: ${id}`)),
        catchError(this.handleError<User[]>('Delete user'))
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
