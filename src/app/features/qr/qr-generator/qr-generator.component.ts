import { Component, computed, input, signal, effect, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [NgOptimizedImage, DialogModule, ButtonModule],
  template: `
    <p-dialog 
      [visible]="visible()" 
      (onHide)="onClose()"
      header="QR код для приєднання до групи"
      [modal]="true"
      [style]="{width: '450px'}"
      [closable]="true">
      
      <div class="qr-container">
        <p>Поділіться цим QR-кодом</p>
        <p class="group-info">Група: {{ groupName() || 'Завантаження...' }}</p>
        
        <div class="qr-image">
          @if (qrImageUrl(); as url) {
            <img 
              [ngSrc]="url" 
              [width]="250" 
              [height]="250" 
              alt="QR код для приєднання до групи"
            />
          } @else {
            <div class="loading">Генерується QR код...</div>
          }
        </div>
        
        <p class="instruction">Відскануйте QR код камерою телефону для приєднання до групи</p>
      </div>
      
      <ng-template pTemplate="footer">
        <p-button 
          label="Закрити" 
          icon="pi pi-times" 
          (onClick)="onClose()" 
          severity="secondary">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .qr-image {
      margin: 1rem 0;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .group-info {
      font-weight: 600;
      color: #1976d2;
      margin: 0 0 1rem;
    }

    .instruction {
      margin: 1rem 0 0;
      color: #666;
      font-size: 0.9rem;
      max-width: 280px;
    }

    .loading {
      padding: 2rem;
      color: #666;
      font-style: italic;
    }
  `]
})
export class QrGeneratorComponent {
  visible = input.required<boolean>();
  groupId = input.required<string>();
  groupName = input<string>('');
  inviteToken = input<string>('');
  
  visibleChange = output<boolean>();
  
  private readonly joinUrl = computed(() => {
    const baseUrl = window.location.origin;
    const token = this.inviteToken();
    if (token) {
      return `${baseUrl}/auth/register?inviteToken=${token}`;
    }
    return `${baseUrl}/auth/register?groupId=${this.groupId()}`;
  });

  readonly qrImageUrl = signal<string>('');

  constructor() {
    effect(() => {
      const groupId = this.groupId();
      const token = this.inviteToken();
      if (groupId && (token || !token)) {
        this.generateQrCode();
      }
    });
  }

  onClose(): void {
    this.visibleChange.emit(false);
  }

  private async generateQrCode(): Promise<void> {
    try {
      const joinUrl = this.joinUrl();
      const url = await QRCode.toDataURL(joinUrl, {
        width: 250,
        margin: 2,
        color: {
          dark: '#1976d2',
          light: '#ffffff'
        }
      });
      this.qrImageUrl.set(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
      this.qrImageUrl.set('');
    }
  }
}
