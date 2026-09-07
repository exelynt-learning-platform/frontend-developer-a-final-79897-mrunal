import { Injectable } from '@angular/core';
import { Client, Account } from 'appwrite';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {

  client: Client;
  account: Account;

  constructor() {
    this.client = new Client()
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);

    this.account = new Account(this.client);
  }
}