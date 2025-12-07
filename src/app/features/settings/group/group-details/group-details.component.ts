import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../core/services/group.service';
import { ToasterService } from '../../../../core/services/utils/toaster.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { InviteTokenResponse } from '../../../../core/interfaces';
import { QrGeneratorComponent } from '../../../qr/qr-generator/qr-generator.component';

@Component({
  selector: 'app-group-details',
  imports: [CommonModule, ButtonModule, AccordionModule, QrGeneratorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly groupService = inject(GroupService);
  private readonly toaster = inject(ToasterService);

  readonly mode = signal<'view'>('view');
  readonly error = signal<string | null>(null);
  readonly isGeneratingQr = signal(false);
  readonly showQrDialog = signal(false);
  readonly inviteToken = signal<string>('');

  readonly groupId = toSignal(
    this.route.paramMap.pipe(switchMap((params) => of(params.get('id')))), { initialValue: '' }
  );

  readonly groupData = toSignal(this.groupService.getGroupsById(this.groupId()!), {
    initialValue: null,
  });

  readonly isLoading = computed(() => !this.groupData() && !this.error());

  goBack(): void {
    this.router.navigate(['/settings/group-list']);
  }

  showGroupInfo(): void {
    const groupId = this.groupId();
    if (groupId) {
      this.router.navigate(['/settings/group', groupId, 'edit']);
    }
  }
  showQrCode(): void {
    const groupId = this.groupId();
    if (!groupId) {
      this.toaster.showError({ detail: 'Group ID not found' });
      return;
    }

    this.isGeneratingQr.set(true);

    this.groupService.getInviteToken(groupId).subscribe({
      next: (qrCodeData: InviteTokenResponse) => {
        this.isGeneratingQr.set(false);
        if (qrCodeData?.token) {
          this.inviteToken.set(qrCodeData.token);
          this.showQrDialog.set(true);
        }
      },
      error: (error) => {
        console.error('Error generating invite token:', error);
        this.toaster.showError({ detail: 'Failed to generate QR code' });
        this.isGeneratingQr.set(false);
      },
    });
  }

  onQrDialogClose(): void {
    this.showQrDialog.set(false);
    this.inviteToken.set('');
  }
}
