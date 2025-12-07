import { ChangeDetectionStrategy, Component, inject, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupFormComponent, GroupFormData } from '../group-form/group-form.component';
import { GroupService } from '../../../core/services/group.service';
import { ToasterService } from '../../../core/services/utils/toaster.service';
import { GroupFullInfo } from '../../../core/interfaces/group-full-info.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of, catchError } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-group-details',
  imports: [CommonModule, GroupFormComponent, ButtonModule],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly groupService = inject(GroupService);
  private readonly toaster = inject(ToasterService);

  readonly mode = signal<'view' | 'edit'>('view');
  readonly isUpdateLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Get group ID from route and load group data
  private readonly groupId = toSignal(this.route.paramMap.pipe(
    switchMap(params => of(params.get('id')))
  ));

  readonly groupData: Signal<GroupFullInfo | null | undefined> = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.error.set('No group ID provided');
          return of(null);
        }
        
        return this.groupService.getGroupsById(id)
      })
    )
  );

  readonly isLoading = computed(() => !this.groupData() && !this.error());

  switchToEditMode(): void {
    this.mode.set('edit');
  }

  cancelEdit(): void {
    this.mode.set('view');
  }

  onUpdateGroup(formData: GroupFormData): void {
    const groupId = this.groupId();
    if (!groupId) {
      this.toaster.showError({ detail: 'Group ID not found' });
      return;
    }

    this.isUpdateLoading.set(true);
    
    // TODO: Implement updateGroup method in service
    console.log('Updating group:', groupId, formData);
    
    // Simulate API call
    setTimeout(() => {
      this.toaster.showSuccess('Group updated successfully!');
      this.mode.set('view');
      this.isUpdateLoading.set(false);
    }, 1000);
  }

  onCancel(): void {
    if (this.mode() === 'edit') {
      this.cancelEdit();
    } else {
      this.goBack();
    }
  }

  goBack(): void {
    this.router.navigate(['/settings/group-list']);
  }
}