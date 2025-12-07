
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GroupService } from '../../../../core/services/group.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { GroupFullInfo } from '../../../../core/interfaces/group-full-info.interface';
import { UserStateService } from '../../../../core/services/store/user-state.service';

@Component({
  selector: 'app-group-list',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupList { 
  #groupService = inject(GroupService);
  #router = inject(Router);
  #userStateService = inject(UserStateService);

  public groupList = toSignal(this.#groupService.getAllGroups(), { initialValue: [] });

  createGroup(): void {
    console.log('Navigate to Create Group');
    this.#router.navigate(['/settings/create-group']);
  }

  viewGroupDetails(groupId: string): void {
    console.log('View group details:', groupId);
    this.#router.navigate(['/settings/group', groupId]);
  }

  isGroupOwner(group: GroupFullInfo): boolean {
    // TODO: Implement logic to check if current user is group owner
    // This would typically check the group.members array for the current user's role
    const currentUser = this.#userStateService.user();
    return !!currentUser; // Placeholder logic
  }
}
