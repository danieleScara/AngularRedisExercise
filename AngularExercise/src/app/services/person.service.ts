import { Injectable } from '@angular/core';
import { IPerson } from '../models/IPerson';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PersonService {

  constructor(private http: Http) { }

  public getPersons(){
    //return this.persons;
    return this.http.get('http://localhost:8081/listPersons');
  }

  public add(person: IPerson): void {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(person);
    this.http.post('http://localhost:8081/addPerson',body, options).subscribe();
  }

  public delete(person: IPerson): void {
    console.log('Deleting: '+person.id);
    this.http.delete('http://localhost:8081/deletePerson/'+person.id).subscribe(
      data => { 
        console.log(data);
    },
      error => console.log("Error deleting: "+error)
    );
  }

  public update(person: IPerson) : void {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(person);
    this.http.post('http://localhost:8081/addPerson',body, options).subscribe();
  }
}
