import { Injectable } from '@angular/core';
import { Request } from '../model/Request';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class JolService {

  constructor(private httpClient: HttpClient) { }

  getData(url: string, request: Request) {
    var httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
    return this.httpClient.post<any>(url, request, httpHeaders);

  }
}
