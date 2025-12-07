import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GroupFormComponent, GroupFormData } from '../group-form/group-form.component';
import { GroupService } from '../../../core/services/group.service';
import { ToasterService } from '../../../core/services/utils/toaster.service';

@Component({
  selector: 'app-create-group',
  imports: [CommonModule, GroupFormComponent],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateGroupComponent {
  private readonly router = inject(Router);
  private readonly groupService = inject(GroupService);
  private readonly toaster = inject(ToasterService);

  readonly isLoading = signal(false);

  onCreateGroup(formData: GroupFormData): void {
    this.isLoading.set(true);
    
    // TODO: Update service to accept full form data
    this.groupService.createGroup(formData).subscribe({
      next: (createdGroup) => {
        this.toaster.showSuccess('Group created successfully!');
        this.router.navigate(['/settings/group-list']);
      },
      error: (error) => {
        console.error('Error creating group:', error);
        this.toaster.showError({ detail: 'Failed to create group. Please try again.' });
        this.isLoading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/settings/group-list']);
  }
}