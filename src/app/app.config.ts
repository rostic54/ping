import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { definePreset } from '@primeuix/themes';

const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        semantic: {
          primary: {
            50: '#e8ebed', // Lightest tint
            100: '#d1d6dc',
            200: '#a4aeb8',
            300: '#778595',
            400: '#4a5d71',
            500: '#121f2d', // Your primary color
            600: '#101b28',
            700: '#0e1824',
            800: '#0c141f',
            900: '#0a111a',
            950: '#080d15', // Darkest shade
          },
          text: {
            primary: '#495057',
            secondary: '#6c757d',
          },
          surface: {
            ground: '#f8f9fa',
            card: '#ffffff',
            overlay: '#ffffff',
            border: '#dee2e6',
          },
        },
      },
      dark: {
        semantic: {
          primary: {
            50: '#080d15', // Reversed for dark mode
            100: '#0a111a',
            200: '#0c141f',
            300: '#0e1824',
            400: '#152334ff',
            500: '#1c2e41ff', // Your primary color
            600: '#2c435aff',
            700: '#3e536dff',
            800: '#5d758fff',
            900: '#96aec7ff',
            950: '#cad5ddff',
          },

          text: {
            primary: '#dadee2ff', // high-contrast white-gray
            secondary: '#aab4bd', // muted text
            tertiary: '#7c8691', // placeholders, hints
            inverse: '#121f2d', // text on light elements
          },

          surface: {
            ground: '{primary.500}', // app background
            section: '#151a20', // panels, cards
            card: '#1a2129',
            overlay: '#1e262f', // dialogs, dropdowns
            border: '#2e3b47', // subtle borders
            hover: '#222b35', // hoverable background
          },

          info: {
            color: '#058aa8ff',
            borderColor: '#06586bff',
            contrastColor: '#6398a3ff',
            hoverColor: '#81D4FA',
            activeColor: '#29B6F6',
          },

          //   neutral: {
          //     color: '#3a4652',
          //     hover: { color: '#485563' },
          //     active: { color: '#2d3944' },
          //     contrast: { color: '#e1e5ea' },
          //   },

          //   accent: {
          //     color: '#4db6ac', // teal accent for links/toggles
          //     hover: { color: '#66c2b9' },
          //     active: { color: '#379b91' },
          //     contrast: { color: '#ffffff' },
          //   },

          //   success: {
          //     color: '#4caf50',
          //     hover: { color: '#5ec25f' },
          //     active: { color: '#3b8f3e' },
          //     contrast: { color: '#ffffff' },
          //   },

          warning: {
            color: '#c69824ff',
            hover: { color: '#d7b237ff' },
            active: { color: '#f9a825' },
            contrast: { color: '#121f2d' },
          },

          danger: {
            color: '#911a12ff',
            hover: { color: '#db2320ff' },
            active: { color: '#d32f2f' },
            contrast: { color: '#ffffff' },
          },

          //   focus: {
          //     ring: '#3c5a7a',
          //     shadow: '0 0 0 0.2rem rgba(44, 104, 179, 0.4)',
          //   },
          // },
          components: {
            button: {
              colorScheme: {
                dark: {
                  root: {
                    primary: {
                      background: '{primary.contrast.color}',
                      hoverBackground: '{primary.hover.color}',
                      activeBackground: '{primary.active.color}',
                      borderColor: '{primary.00}',
                      hoverBorderColor: '{primary.hover.color}',
                      activeBorderColor: '{primary.active.color}',
                      color: '{primary.contrast.color}',
                      hoverColor: '{primary.contrast.color}',
                      activeColor: '{primary.contrast.color}',
                      focusRing: {
                        color: '{focus.ring}',
                        shadow: '{focus.shadow}',
                      },
                    },
                  },
                },
                info: {
                  root: {
                    outlined: {
                      borderColor: '#d7ee22ff', // <-- змінює --p-button-outlined-info-border-color
                      color: '#bb0fb5ff',
                      hoverBorderColor: '#81D4FA',
                      hoverColor: '#81D4FA',
                      activeBorderColor: '#29B6F6',
                      activeColor: '#29B6F6',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
      },
    }),
    MessageService,
  ],
};
