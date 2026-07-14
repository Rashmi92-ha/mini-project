import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from'../../features/👥user/models/user';
import { API_ENPOINTS } from '../../shared/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = API_ENPOINTS.AUTH.USERS;
  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl);
  }

  addUsers(user: User): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl, user);
  }

  getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl} /${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrl}/${user._id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
