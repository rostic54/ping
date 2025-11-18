import { Component } from '@angular/core';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CardModule, ButtonModule, DividerModule],
  template: `
    <div class="verify-container flex center middle">
      <p-card>
        <div class="verify-content flex column">
          <h1>Verify Your Email</h1>
          
          <p-divider />
          
          <div class="message-section flex column">
            <p class="verification-message">
              We've sent a verification link to your email address.
              Please check your inbox and click the link to activate your account.
            </p>
            
            <p class="additional-info">
              If you don't see the email, please check your spam folder.
            </p>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .verify-container {
      min-height: 100vh;
      padding: 1rem;
      background-color: var(--surface-ground);
    }

    .verify-content {
      gap: 1.5rem;
      min-width: 300px;
      max-width: 450px;
    }

    h1 {
      text-align: center;
      color: var(--primary-color);
      margin: 0;
    }

    .message-section {
      gap: 1rem;
      text-align: center;
    }

    .verification-message {
      font-size: 1.1rem;
      line-height: 1.5;
      margin: 0;
    }

    .additional-info {
      color: var(--text-color-secondary);
      font-size: 0.9rem;
      margin: 0;
    }
  `],
})
export class VerifyComponent {
    // TODO: Redirect to Login or Home according to Token availability
}