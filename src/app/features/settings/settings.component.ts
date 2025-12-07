import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [CardModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  navigateToTimeTemplates(): void {
    // TODO: Navigate to time templates page when route is created
    console.log('Navigate to Time Templates');
    // this.router.navigate(['/time-templates']);
  }

  navigateToGroupManagement(): void {
    this.router.navigate(['group-list'], { relativeTo: this.activatedRoute });
  }
}