import { Component, computed, input } from '@angular/core';
import { NgOptimizedImage, AsyncPipe } from '@angular/common';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [NgOptimizedImage, AsyncPipe],
  template: `
    <div class="qr-container">
      <h3>Поділіться цим QR-кодом</h3>
      <p>Відскануйте для приєднання до групи</p>
      <div class="qr-image">
        @if (qrImageUrl() | async; as url) {
          <img 
            [ngSrc]="url" 
            [width]="300" 
            [height]="300" 
            alt="QR код для приєднання до групи "
          />
        }
      </div>
    </div>
  `,
  styles: [`
    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      text-align: center;
    }

    .qr-image {
      margin: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h3 {
      margin: 0 0 0.5rem;
      color: #333;
    }

    p {
      margin: 0 0 1rem;
      color: #666;
    }
  `]
})
export class QrGeneratorComponent {
  groupId = input.required<string>();
  
  private readonly joinUrl = computed(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth/register?groupId=${this.groupId()}`;
  });

  readonly qrImageUrl = computed(async () => {
    try {
      const url = await QRCode.toDataURL(this.joinUrl(), {
        width: 300,
        margin: 2,
        color: {
          dark: '#1976d2',
          light: '#ffffff'
        }
      });
      return url;
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  });
}
