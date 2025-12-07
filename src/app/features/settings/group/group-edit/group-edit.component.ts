import { ChangeDetectionStrategy, Component, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../../core/services/group.service';
import { ToasterService } from '../../../../core/services/utils/toaster.service';
import { GroupFormComponent, GroupFormData } from '../group-form/group-form.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { GroupFullInfo } from '../../../../core/interfaces/group-full-info.interface';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-edit',
  imports: [GroupFormComponent, ButtonModule, CommonModule],
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupEditComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toaster = inject(ToasterService);
  private readonly groupService = inject(GroupService);

  readonly mode = signal<'view' | 'edit'>('view');
  readonly isUpdateLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly isLoading = signal(false);

  // Get group ID from route and load group data
  private readonly groupId = toSignal(
    this.route.paramMap.pipe(switchMap((params) => of(params.get('id'))))
  );

  readonly groupData: Signal<GroupFullInfo | null> = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        if (!id) {
          this.error.set('No group ID provided');
          return of(null);
        }

        return this.groupService.getGroupsById(id);
      })
    ),
    { initialValue: null }
  );


  onEditGroup(formData: GroupFormData): void {
    this.isLoading.set(true);

    const groupId = this.route.snapshot.paramMap.get('id');
    if (!groupId) {
      this.toaster.showError({ detail: 'Group ID not found' });
      this.isLoading.set(false);
      return;
    }

    // TODO: Update service to accept full form data
    this.groupService.updateGroup(groupId, formData).subscribe({
      next: (updatedGroup) => {
        this.toaster.showSuccess('Group edited successfully!');
        this.router.navigate(['/settings/group-list']);
      },
      error: (error) => {
        console.error('Error editing group:', error);
        this.toaster.showError({ detail: 'Failed to edit group. Please try again.' });
        this.isLoading.set(false);
      },
    });
  }

  onCancel(): void {
    this.router.navigate([`/settings/group/${this.groupId()}/details`]);
  }

  //  private readonly router = inject(Router);
  // private readonly route = inject(ActivatedRoute);
  // private readonly groupService = inject(GroupService);
  // private readonly toaster = inject(ToasterService);

  
  // readonly isLoading = computed(() => !this.groupData() && !this.error());

  switchToEditMode(): void {
    this.mode.set('edit');
  }

  cancelEdit(): void {
    this.mode.set('view');
  }

  // onUpdateGroup(formData: GroupFormData): void {
  //   const groupId = this.groupId();
  //   if (!groupId) {
  //     this.toaster.showError({ detail: 'Group ID not found' });
  //     return;
  //   }

  //   this.isUpdateLoading.set(true);

  //   // TODO: Implement updateGroup method in service
  //   console.log('Updating group:', groupId, formData);

  //   // Simulate API call
  //   setTimeout(() => {
  //     this.toaster.showSuccess('Group updated successfully!');
  //     this.mode.set('view');
  //     this.isUpdateLoading.set(false);
  //   }, 1000);
  // }
}
