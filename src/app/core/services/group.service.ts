import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, UnaryFunction } from 'rxjs';
import { GroupFullInfo } from '../interfaces/group-full-info.interface';
import { environment } from '../../../environments/environment';
import { GroupFormData } from '../../features/settings/group/group-form/group-form.component';
import { InviteTokenResponse } from '../interfaces';

export interface Group {
  id: string;
  name: string;
  ownerId: string;
  members: string[]; // масив ID користувачів
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  #httpClient = inject(HttpClient);
  private readonly groups = signal<Group[]>([]);

  createGroup(groupDetails: GroupFormData): Observable<GroupFullInfo> {
    return this.#httpClient.post<GroupFullInfo>(`${environment.apiUrl}/groups`, groupDetails)
  }

  updateGroup(groupId: string, groupDetails: GroupFormData): Observable<GroupFullInfo> {
    return this.#httpClient.put<GroupFullInfo>(`${environment.apiUrl}/groups/${groupId}`, groupDetails)
  }

  getGroupsById(groupId: string): Observable<GroupFullInfo> {
    return this.#httpClient.get<GroupFullInfo>(`${environment.apiUrl}/groups/${groupId}`);
  }

  getAllGroups(): Observable<GroupFullInfo[]> {
    return this.#httpClient.get<GroupFullInfo[]>(`${environment.apiUrl}/groups/list`);
  }

  getInviteToken(groupId: string): Observable<InviteTokenResponse> {
    return this.#httpClient.get<InviteTokenResponse>(`${environment.apiUrl}/groups/invite/${groupId}`);
  }

  getGroupById(groupId: string | undefined): Group | undefined {
    return this.groups().find(group => group.id === groupId);
  }
}
