import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, UnaryFunction } from 'rxjs';
import { GroupFullInfo } from '../interfaces/group-full-info.interface';
import { environment } from '../../../environments/environment';
import { GroupFormData } from '../../features/settings/group-form/group-form.component';

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

  getGroupsById(groupId: string): Observable<GroupFullInfo> {
    return this.#httpClient.get<GroupFullInfo>(`${environment.apiUrl}/groups/${groupId}`);
  }

  getAllGroups(): Observable<GroupFullInfo[]> {
    return this.#httpClient.get<GroupFullInfo[]>(`${environment.apiUrl}/groups/list`);
  }

  // async joinGroup(groupId: string, userId: string): Promise<boolean> {
  //   // TODO: Замінити на реальний API запит
  //   this.groups.update(groups => 
  //     groups.map(group => 
  //       group.id === groupId 
  //         ? { ...group, members: [...group.members, userId] }
  //         : group
  //     )
  //   );

  //   return true;
  // }

  getGroupById(groupId: string | undefined): Group | undefined {
    return this.groups().find(group => group.id === groupId);
  }
}
