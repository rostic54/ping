import { Routes } from '@angular/router';
import { QrGeneratorComponent } from './qr-generator/qr-generator.component';

export const QR_ROUTES: Routes = [
  {
    path: 'share/:groupId',
    component: QrGeneratorComponent
  }
];
