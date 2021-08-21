import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/models/employee';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  getResponse(): Observable<Employee[]> {
    return this.http.get<any>('assets/response.json').pipe(
      map((e) => {
        e.forEach((k: any) => {
          k.joining_date = this.getDate(k.joining_date);
        });
        return e;
    })
    )
  }

  getDate(s: string): Date {
    const arr = s.split('/');
      const day = parseInt((arr[0].length < 2) ? `0${arr[0]}` : arr[0]);
      const month = parseInt((arr[1].length < 2) ? `0${arr[1]}` : `${arr[1]}`);
      return new Date(parseInt(arr[2]), month, day);
  }
}
