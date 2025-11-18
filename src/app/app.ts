import { Component, inject, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.scss'
})
export class App {
  isAuthenticated: Signal<boolean> = inject(AuthService).isAuthenticated;
}
