import { 
  ChangeDetectionStrategy, 
  Component, 
  input, 
  output, 
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DividerModule } from 'primeng/divider';
import { GroupFullInfo } from '../../../core/interfaces/group-full-info.interface';

export type FormMode = 'create' | 'edit' | 'view';

export interface GroupFormData {
  name: string;
  description?: string;
  maxMembers: number;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

@Component({
  selector: 'app-group-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ButtonModule,
    FloatLabel,
    ToggleButtonModule,
    DividerModule
  ],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupFormComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  readonly mode = input.required<FormMode>();
  readonly groupData = input<GroupFullInfo | null>(null);
  readonly isLoading = input<boolean>(false);

  // Outputs
  readonly formSubmit = output<GroupFormData>();
  readonly formCancel = output<void>();

  // Location state
  readonly isGettingLocation = signal(false);
  readonly locationError = signal<string | null>(null);
  readonly locationMode = signal<'auto' | 'manual'>('auto');

  // Form
  groupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    description: ['', [Validators.maxLength(200)]],
    maxMembers: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
    latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
    isActive: [true]
  });

  constructor() {
    // Update form when group data changes
    effect(() => {
      const group = this.groupData();
      if (group) {
        this.groupForm.patchValue({
          name: group.name,
          description: group.description || '',
          maxMembers: group.maxMembers,
          latitude: group.latitude,
          longitude: group.longitude,
          isActive: group.isActive
        });
      }
    });

    // Disable form in view mode
    effect(() => {
      if (this.mode() === 'view') {
        this.groupForm.disable();
      } else {
        this.groupForm.enable();
      }
    });

    // Update coordinate fields based on location mode
    effect(() => {
      const mode = this.locationMode();
      const latControl = this.groupForm.get('latitude');
      const lngControl = this.groupForm.get('longitude');
      
      if (mode === 'auto') {
        latControl?.disable();
        lngControl?.disable();
      } else {
        latControl?.enable();
        lngControl?.enable();
      }
    });
  }

  getFormTitle(): string {
    switch (this.mode()) {
      case 'create':
        return 'Create New Group';
      case 'edit':
        return 'Edit Group';
      case 'view':
        return 'Group Details';
      default:
        return 'Group Form';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.groupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.locationError.set('Geolocation is not supported by this browser');
      return;
    }

    this.isGettingLocation.set(true);
    this.locationError.set(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.groupForm.patchValue({
          latitude: latitude,
          longitude: longitude
        });
        this.isGettingLocation.set(false);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        this.locationError.set(errorMessage);
        this.isGettingLocation.set(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  clearLocation(): void {
    this.groupForm.patchValue({
      latitude: null,
      longitude: null
    });
    this.locationError.set(null);
  }

  getLocationString(): string {
    const lat = this.groupForm.get('latitude')?.value;
    const lng = this.groupForm.get('longitude')?.value;
    if (lat && lng) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
    return 'No location set';
  }

  setLocationMode(mode: 'auto' | 'manual'): void {
    this.locationMode.set(mode);
    this.locationError.set(null);
    
    if (mode === 'auto') {
      // Clear manual coordinates when switching to auto mode
      this.groupForm.patchValue({
        latitude: null,
        longitude: null
      });
    }
  }

  onSubmit(): void {
    if (this.groupForm.valid && this.mode() !== 'view') {
      this.formSubmit.emit(this.groupForm.value);
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}