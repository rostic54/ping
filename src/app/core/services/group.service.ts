import { Injectable, signal } from '@angular/core';
import { UnaryFunction } from 'rxjs';

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
  private readonly groups = signal<Group[]>([]);

  async createGroup(name: string, ownerId: string): Promise<string> {
    const groupId = crypto.randomUUID();
    
    // TODO: Замінити на реальний API запит
    this.groups.update(groups => [...groups, {
      id: groupId,
      name,
      ownerId,
      members: [ownerId]
    }]);

    return groupId;
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
